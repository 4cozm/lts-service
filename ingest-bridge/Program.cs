using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading;
using DotNetEnv;
using LiteDB;
using StackExchange.Redis;

// System.Text.Json만 명시적으로 사용 (LiteDB.JsonSerializer 충돌 방지)
using STJ = System.Text.Json;

namespace LtsIngestBridge
{
    internal static class Program
    {
        private const string DefaultStreamKey = "lts:match:ingest";
        private const string DefaultCollectionName = "game";
        private const int DefaultPollIntervalMs = 2000;
        private const string RedisConnection = "127.0.0.1:6379";
        /// <summary>이미 스트림에 푸시한 경기 Id 집합. 멱등 전달을 위해 새 경기만 푸시.</summary>
        private const string ArenaPushedSetKey = "checkpoint:arena:pushed";

        private static int Main(string[] args)
        {
            Console.OutputEncoding = Encoding.UTF8;

            Env.TraversePath().Load();

            string? dbPath = args.Length >= 1
                ? args[0].Trim()
                : (Environment.GetEnvironmentVariable("LITEDB_ARENA_PATH") ?? Environment.GetEnvironmentVariable("LITEDB_PATH"))?.Trim();

            if (string.IsNullOrWhiteSpace(dbPath))
            {
                PrintUsage();
                return 2;
            }

            string? passwordRaw = Environment.GetEnvironmentVariable("LITEDB_PASSWORD");
            string? password = string.IsNullOrWhiteSpace(passwordRaw) ? null : passwordRaw.Trim();
            string streamKey = Environment.GetEnvironmentVariable("INGEST_STREAM_KEY") ?? DefaultStreamKey;
            string collectionName = Environment.GetEnvironmentVariable("GAME_COLLECTION_NAME") ?? DefaultCollectionName;
            int pollMs = int.TryParse(Environment.GetEnvironmentVariable("POLL_INTERVAL_MS"), out var ms) ? ms : DefaultPollIntervalMs;

            Console.WriteLine($"Redis: {RedisConnection}");
            Console.WriteLine($"Stream: {streamKey}");
            Console.WriteLine($"LiteDB (arena): {dbPath}");
            Console.WriteLine($"Poll interval: {pollMs}ms");
            Console.WriteLine("Press Ctrl+C to stop.");
            Console.WriteLine();

            try
            {
                using var redis = ConnectionMultiplexer.Connect(RedisConnection);
                var redisDb = redis.GetDatabase();
                long lastSize = -1;

                while (true)
                {
                    try
                    {
                        if (!File.Exists(dbPath))
                        {
                            lastSize = -1;
                            Thread.Sleep(pollMs);
                            continue;
                        }

                        var fi = new FileInfo(dbPath);
                        long currentSize = fi.Length;
                        if (currentSize != lastSize)
                        {
                            int written = PushSlimGameResultsToStream(redisDb, dbPath, password, collectionName, streamKey);
                            if (written > 0)
                                Console.WriteLine($"[{DateTime.Now:HH:mm:ss}] Pushed {written} match(es) to stream.");
                            lastSize = currentSize;
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[{DateTime.Now:HH:mm:ss}] Error: {ex.Message}");
                    }

                    Thread.Sleep(pollMs);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Fatal: {ex}");
                return 1;
            }
        }

        private static int PushSlimGameResultsToStream(IDatabase redisDb, string dbPath, string? password, string collectionName, string streamKey)
        {
            foreach (var cs in BuildConnectionStrings(dbPath, password))
            {
                try
                {
                    using var db = new LiteDatabase(cs);
                    var col = db.GetCollection(collectionName);
                    var collected = new List<(string? matchId, string summaryJson, string? launchTime)>();

                    foreach (var doc in col.FindAll())
                    {
                        if (!TryGetSerializedStoredItem(doc, out var storedJson) || string.IsNullOrWhiteSpace(storedJson))
                            continue;
                        if (!TryBuildSlimSummary(storedJson!, out var summaryJson))
                            continue;

                        string? matchId = TryGetIdFromSummaryJson(summaryJson);
                        string? launchTime = TryGetLaunchTimeFromSummaryJson(summaryJson);
                        collected.Add((matchId, summaryJson, launchTime));
                    }

                    collected.Sort((a, b) =>
                    {
                        var ta = ParseLaunchTimeToTicks(a.launchTime);
                        var tb = ParseLaunchTimeToTicks(b.launchTime);
                        return tb.CompareTo(ta);
                    });

                    var seenIds = new HashSet<string?>(StringComparer.OrdinalIgnoreCase);
                    var deduped = new List<(string? matchId, string summaryJson)>();
                    foreach (var (matchId, summaryJson, _) in collected)
                    {
                        if (string.IsNullOrWhiteSpace(matchId)) { deduped.Add((matchId, summaryJson)); continue; }
                        if (seenIds.Contains(matchId)) continue;
                        seenIds.Add(matchId);
                        deduped.Add((matchId, summaryJson));
                    }

                    int written = 0;
                    foreach (var (matchId, summaryJson) in deduped)
                    {
                        if (!string.IsNullOrWhiteSpace(matchId) && redisDb.SetContains(ArenaPushedSetKey, matchId))
                            continue;

                        redisDb.StreamAdd(streamKey, "payload", summaryJson);
                        if (!string.IsNullOrWhiteSpace(matchId))
                            redisDb.SetAdd(ArenaPushedSetKey, matchId);
                        written++;
                    }

                    return written;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"LiteDB open failed: {ex.Message}");
                }
            }

            return 0;
        }

        private static string? TryGetLaunchTimeFromSummaryJson(string summaryJson)
        {
            try
            {
                using var j = STJ.JsonDocument.Parse(summaryJson);
                if (j.RootElement.TryGetProperty("LaunchTime", out var el))
                    return el.GetString();
            }
            catch { /* ignore */ }
            return null;
        }

        private static long ParseLaunchTimeToTicks(string? launchTime)
        {
            if (string.IsNullOrWhiteSpace(launchTime)) return DateTimeOffset.MinValue.Ticks;
            return DateTimeOffset.TryParse(launchTime, out var dt) ? dt.Ticks : DateTimeOffset.MinValue.Ticks;
        }

        private static string? TryGetIdFromSummaryJson(string summaryJson)
        {
            try
            {
                using var j = STJ.JsonDocument.Parse(summaryJson);
                if (j.RootElement.TryGetProperty("Id", out var idEl))
                    return idEl.GetString();
            }
            catch { /* ignore */ }
            return null;
        }

        private static bool TryGetSerializedStoredItem(BsonDocument doc, out string? storedJson)
        {
            storedJson = null;

            if (doc.ContainsKey("SerializedStoredItem") && doc["SerializedStoredItem"].IsString)
            {
                storedJson = doc["SerializedStoredItem"].AsString;
                return true;
            }

            string? best = null;
            int bestLen = -1;

            foreach (var key in doc.Keys)
            {
                var val = doc[key];
                if (!val.IsString) continue;

                if (!key.Contains("Serialized", StringComparison.OrdinalIgnoreCase) &&
                    !key.Contains("Stored", StringComparison.OrdinalIgnoreCase) &&
                    !key.Contains("Payload", StringComparison.OrdinalIgnoreCase) &&
                    !key.Contains("Data", StringComparison.OrdinalIgnoreCase) &&
                    !key.Contains("Item", StringComparison.OrdinalIgnoreCase))
                    continue;

                var s = val.AsString;
                if (string.IsNullOrWhiteSpace(s)) continue;

                if (s.Length > bestLen)
                {
                    bestLen = s.Length;
                    best = s;
                }
            }

            storedJson = best;
            return storedJson != null;
        }

        private static bool TryBuildSlimSummary(string storedJson, out string summaryJson)
        {
            summaryJson = "";

            try
            {
                using var jd = STJ.JsonDocument.Parse(storedJson);
                var root = jd.RootElement;

                if (!root.TryGetProperty("Id", out _)) return false;
                if (!root.TryGetProperty("LaunchTime", out _)) return false;
                if (!root.TryGetProperty("Teams", out var teamsEl) || teamsEl.ValueKind != STJ.JsonValueKind.Object)
                    return false;

                int totalPlayers = 0;
                foreach (var teamProp in teamsEl.EnumerateObject())
                {
                    var teamEl = teamProp.Value;
                    if (teamEl.TryGetProperty("Players", out var playersEl) && playersEl.ValueKind == STJ.JsonValueKind.Array)
                        totalPlayers += playersEl.GetArrayLength();
                }
                if (totalPlayers < 1) return false;

                string? matchId = TryGetString(root, "Id");
                string? matchName = TryGetString(root, "Name");
                string? launchTime = TryGetString(root, "LaunchTime");
                string? finishTime = TryGetString(root, "FinishTime");

                double? durationSeconds = null;
                if (DateTimeOffset.TryParse(launchTime, out var lt) && DateTimeOffset.TryParse(finishTime, out var ft))
                    durationSeconds = (ft - lt).TotalSeconds;

                var idToName = new Dictionary<int, string>();
                var teamsDict = new Dictionary<string, object>(StringComparer.OrdinalIgnoreCase);
                var teamIdByKey = new Dictionary<string, string?>(StringComparer.OrdinalIgnoreCase);

                foreach (var teamProp in teamsEl.EnumerateObject())
                {
                    var teamKey = teamProp.Name;
                    var teamEl = teamProp.Value;
                    string? teamId = TryGetString(teamEl, "Id");
                    int? score = TryGetInt(teamEl, "Score");
                    var players = ExtractSlimPlayers(teamEl, teamKey, idToName);
                    teamsDict[teamKey] = new { Id = teamId, Score = score, Players = players };
                    teamIdByKey[teamKey] = teamId;
                }

                string? winTeamId = null;
                int? resultType = null;
                string? winSide = null;
                object? firstBloodObj = null;

                if (root.TryGetProperty("Statistics", out var matchStatsEl))
                {
                    if (matchStatsEl.TryGetProperty("Result", out var resultEl))
                    {
                        if (resultEl.TryGetProperty("WinTeamIds", out var winIdsEl) &&
                            winIdsEl.ValueKind == STJ.JsonValueKind.Array &&
                            winIdsEl.GetArrayLength() > 0)
                        {
                            winTeamId = winIdsEl[0].GetString();
                            foreach (var kv in teamIdByKey)
                            {
                                if (winTeamId != null && kv.Value != null &&
                                    winTeamId.Equals(kv.Value, StringComparison.OrdinalIgnoreCase))
                                {
                                    winSide = kv.Key;
                                    break;
                                }
                            }
                            if (winSide == null) winSide = "Unknown";
                        }
                        resultType = TryGetInt(resultEl, "ResultType");
                    }

                    if (matchStatsEl.TryGetProperty("FirstBlood", out var fbEl) && fbEl.ValueKind == STJ.JsonValueKind.Object)
                    {
                        int? killerId = TryGetInt(fbEl, "ExterminatorPlayerId");
                        int? victimId = TryGetInt(fbEl, "VictimPlayerId");

                        string? killerName = (killerId.HasValue && idToName.TryGetValue(killerId.Value, out var kn)) ? kn : null;
                        string? victimName = (victimId.HasValue && idToName.TryGetValue(victimId.Value, out var vn)) ? vn : null;

                        firstBloodObj = new
                        {
                            KillerPlayerId = killerId,
                            KillerName = killerName,
                            VictimPlayerId = victimId,
                            VictimName = victimName
                        };
                    }
                }

                var resultObj = new Dictionary<string, object?>
                {
                    ["WinTeamId"] = winTeamId,
                    ["WinSide"] = winSide ?? "Unknown",
                    ["ResultType"] = resultType
                };

                var summary = new Dictionary<string, object?>
                {
                    ["Id"] = matchId,
                    ["Name"] = matchName,
                    ["LaunchTime"] = launchTime,
                    ["FinishTime"] = finishTime,
                    ["DurationSeconds"] = durationSeconds,
                    ["Teams"] = teamsDict,
                    ["Result"] = resultObj,
                    ["FirstBlood"] = firstBloodObj
                };

                summaryJson = STJ.JsonSerializer.Serialize(summary);
                return true;
            }
            catch (STJ.JsonException)
            {
                return false;
            }
        }

        private static List<object> ExtractSlimPlayers(STJ.JsonElement teamEl, string side, Dictionary<int, string> idToName)
        {
            var list = new List<object>();

            if (!teamEl.TryGetProperty("Players", out var playersEl) || playersEl.ValueKind != STJ.JsonValueKind.Array)
                return list;

            foreach (var pEl in playersEl.EnumerateArray())
            {
                int? playerId = null;
                string? playerName = null;

                if (pEl.TryGetProperty("Entity", out var entityEl) && entityEl.ValueKind == STJ.JsonValueKind.Object)
                    playerName = TryGetString(entityEl, "PlayerName");

                if (pEl.TryGetProperty("Context", out var ctxEl))
                {
                    if (string.IsNullOrWhiteSpace(playerName) &&
                        ctxEl.TryGetProperty("Info", out var infoEl) && infoEl.ValueKind == STJ.JsonValueKind.Object)
                        playerName = TryGetString(infoEl, "Name");

                    int? infoId = null;
                    if (ctxEl.TryGetProperty("Info", out var infoEl2) && infoEl2.ValueKind == STJ.JsonValueKind.Object)
                        infoId = TryGetInt(infoEl2, "Id");
                    int? deviceId = TryGetInt(ctxEl, "DeviceId");
                    int? preconfiguredDeviceId = TryGetInt(ctxEl, "PreconfiguredDeviceId");
                    playerId = deviceId ?? preconfiguredDeviceId ?? infoId;
                    if (playerId.HasValue && !string.IsNullOrWhiteSpace(playerName))
                    {
                        idToName[playerId.Value] = playerName;
                        if (infoId.HasValue && infoId.Value != playerId.Value)
                            idToName[infoId.Value] = playerName;
                    }
                }

                int kills = 0;
                int deaths = 0;
                int shots = 0;
                int hits = 0;
                double damage = 0;
                int fatalHits = 0;

                int score = 0;
                int? maxConsecutiveKills = null;

                Dictionary<string, int>? medals = null;

                if (pEl.TryGetProperty("Context", out var ctx2El) &&
                    ctx2El.TryGetProperty("Sessions", out var sessionsEl) &&
                    sessionsEl.ValueKind == STJ.JsonValueKind.Array)
                {
                    foreach (var sEl in sessionsEl.EnumerateArray())
                    {
                        if (!sEl.TryGetProperty("Statistics", out var stEl) || stEl.ValueKind != STJ.JsonValueKind.Object)
                            continue;

                        deaths += TryGetInt(stEl, "Deaths") ?? 0;
                        shots += TryGetInt(stEl, "Shots") ?? 0;
                        score += TryGetInt(stEl, "Score") ?? 0;

                        if (stEl.TryGetProperty("_killings", out var kEl) && kEl.ValueKind == STJ.JsonValueKind.Array)
                            kills += kEl.GetArrayLength();

                        if (stEl.TryGetProperty("OutHitsList", out var ohEl) && ohEl.ValueKind == STJ.JsonValueKind.Array)
                        {
                            foreach (var hitEl in ohEl.EnumerateArray())
                            {
                                hits++;

                                if (hitEl.TryGetProperty("Damage", out var dmgEl) && dmgEl.ValueKind == STJ.JsonValueKind.Number)
                                    damage += dmgEl.GetDouble();

                                if (hitEl.TryGetProperty("IsFatalDamage", out var fatalEl) &&
                                    (fatalEl.ValueKind == STJ.JsonValueKind.True || fatalEl.ValueKind == STJ.JsonValueKind.False) &&
                                    fatalEl.GetBoolean())
                                {
                                    fatalHits++;
                                }
                            }
                        }

                        maxConsecutiveKills = MaxNullable(maxConsecutiveKills, TryGetInt(stEl, "MaxConsecutiveKills"));

                        if (stEl.TryGetProperty("MedalsMap", out var medalsEl) && medalsEl.ValueKind == STJ.JsonValueKind.Object)
                        {
                            medals ??= new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
                            foreach (var prop in medalsEl.EnumerateObject())
                            {
                                if (prop.Value.ValueKind == STJ.JsonValueKind.Number && prop.Value.TryGetInt32(out var mv))
                                {
                                    medals[prop.Name] = (medals.TryGetValue(prop.Name, out var cur) ? cur : 0) + mv;
                                }
                            }
                        }
                    }
                }

                double? accuracy = (shots > 0) ? (double)hits / shots : null;
                double? kd = (deaths > 0) ? (double)kills / deaths : (double?)null;

                var playerObj = new
                {
                    PlayerId = playerId,
                    PlayerName = playerName,

                    Kills = kills,
                    Deaths = deaths,
                    KD = kd,

                    Score = score,

                    Shots = shots,
                    Hits = hits,
                    Accuracy = accuracy,

                    DamageDealt = damage,
                    FatalHits = fatalHits,

                    MaxConsecutiveKills = maxConsecutiveKills,

                    Medals = medals
                };

                list.Add(playerObj);
            }

            return list;
        }

        private static int? MaxNullable(int? a, int? b)
        {
            if (!a.HasValue) return b;
            if (!b.HasValue) return a;
            return Math.Max(a.Value, b.Value);
        }

        private static string? TryGetString(STJ.JsonElement obj, string prop)
        {
            if (obj.ValueKind != STJ.JsonValueKind.Object) return null;
            if (!obj.TryGetProperty(prop, out var el)) return null;
            return el.ValueKind == STJ.JsonValueKind.String ? el.GetString() : el.ToString();
        }

        private static int? TryGetInt(STJ.JsonElement obj, string prop)
        {
            if (obj.ValueKind != STJ.JsonValueKind.Object) return null;
            if (!obj.TryGetProperty(prop, out var el)) return null;

            if (el.ValueKind == STJ.JsonValueKind.Number && el.TryGetInt32(out var v)) return v;
            if (el.ValueKind == STJ.JsonValueKind.String && int.TryParse(el.GetString(), out var sv)) return sv;
            return null;
        }

        private static IEnumerable<string> BuildConnectionStrings(string dbPath, string? password)
        {
            if (!string.IsNullOrEmpty(password))
            {
                yield return $"Filename={dbPath};Password={password};";
                yield return $"Filename={dbPath};";
                yield break;
            }

            yield return $"Filename={dbPath};";
        }

        private static void PrintUsage()
        {
            Console.WriteLine("LtsIngestBridge - arena.data to Redis Stream");
            Console.WriteLine();
            Console.WriteLine("Usage:");
            Console.WriteLine(@"  dotnet run -- ""<arena.data 경로>""");
            Console.WriteLine("  Or set LITEDB_ARENA_PATH (or LITEDB_PATH) in .env and run without args (e.g. from Node).");
        }
    }
}

using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading;
using DotNetEnv;
using LiteDB;
using StackExchange.Redis;
using STJ = System.Text.Json;

namespace LtsIngestBridge;

internal static class Program
{
    private const string DefaultStreamKey = "lts:match:ingest";
    private const string DefaultCollectionName = "game";
    private const int DefaultPollIntervalMs = 2000;
    private const string RedisConnection = "127.0.0.1:6379";

    // #region agent log
    private static void DebugLog(string location, string message, object? data, string hypothesisId)
    {
        try
        {
            var logPath = Path.Combine(Environment.CurrentDirectory, ".cursor", "debug.log");
            var dir = Path.GetDirectoryName(logPath);
            if (!string.IsNullOrEmpty(dir)) Directory.CreateDirectory(dir);
            var line = STJ.JsonSerializer.Serialize(new Dictionary<string, object?>
            {
                ["timestamp"] = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                ["location"] = location,
                ["message"] = message,
                ["data"] = data,
                ["hypothesisId"] = hypothesisId
            }) + "\n";
            File.AppendAllText(logPath, line);
        }
        catch { /* ignore */ }
    }
    // #endregion

    private static int Main(string[] args)
    {
        Console.OutputEncoding = Encoding.UTF8;

        // Load root .env (current dir or parent when run from ingest-bridge)
        Env.TraversePath().Load();

        var streamKey = Environment.GetEnvironmentVariable("INGEST_STREAM_KEY") ?? DefaultStreamKey;
        // 경기 기록 DB (arena.data). 구버전 호환: LITEDB_ARENA_PATH 없으면 LITEDB_PATH 사용. ref와 동일하게 파일 경로로만 접근.
        var rawArena = Environment.GetEnvironmentVariable("LITEDB_ARENA_PATH");
        var rawLegacy = Environment.GetEnvironmentVariable("LITEDB_PATH");
        // #region agent log
        DebugLog("Program.Main", "env before normalize", new Dictionary<string, object?> { ["LITEDB_ARENA_PATH"] = rawArena, ["LITEDB_PATH"] = rawLegacy, ["arenaLen"] = rawArena?.Length ?? 0, ["legacyLen"] = rawLegacy?.Length ?? 0 }, "H1");
        // #endregion
        var dbPath = NormalizePath(rawArena ?? rawLegacy);
        var pollMs = int.TryParse(Environment.GetEnvironmentVariable("POLL_INTERVAL_MS"), out var ms) ? ms : DefaultPollIntervalMs;
        var passwordRaw = Environment.GetEnvironmentVariable("LITEDB_PASSWORD");
        var password = string.IsNullOrWhiteSpace(passwordRaw) ? null : passwordRaw!.Trim();
        var collectionName = Environment.GetEnvironmentVariable("GAME_COLLECTION_NAME") ?? DefaultCollectionName;

        // #region agent log
        DebugLog("Program.Main", "after normalize and password", new Dictionary<string, object?> { ["dbPath"] = dbPath, ["dbPathLength"] = dbPath?.Length ?? 0, ["fileExists"] = dbPath != null && File.Exists(dbPath), ["passwordIsNull"] = password == null, ["passwordLength"] = password?.Length ?? 0 }, "H1");
        DebugLog("Program.Main", "path for H2", new Dictionary<string, object?> { ["resolvedPath"] = dbPath != null ? Path.GetFullPath(dbPath) : null }, "H2");
        // #endregion

        if (string.IsNullOrWhiteSpace(dbPath))
        {
            Console.WriteLine("LITEDB_ARENA_PATH (or LITEDB_PATH) is required for arena/match data.");
            return 2;
        }

        Console.WriteLine($"Redis: {RedisConnection}");
        Console.WriteLine($"Stream: {streamKey}");
        Console.WriteLine($"LiteDB (arena): {dbPath}");
        Console.WriteLine($"Poll interval: {pollMs}ms");
        Console.WriteLine("Press Ctrl+C to stop.");
        Console.WriteLine();

        try
        {
            using var redis = ConnectionMultiplexer.Connect(RedisConnection);
            var db = redis.GetDatabase();
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
                    var currentSize = fi.Length;
                    if (currentSize != lastSize)
                    {
                        var written = PushSlimGameResultsToStream(db, dbPath, password, collectionName, streamKey);
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
        // #region agent log
        DebugLog("PushSlimGameResultsToStream", "entry", new Dictionary<string, object?> { ["dbPath"] = dbPath, ["passwordIsNull"] = password == null, ["passwordLen"] = password?.Length ?? 0 }, "H3");
        // #endregion
        foreach (var cs in BuildConnectionStrings(dbPath, password))
        {
            // #region agent log
            var maskedCs = cs.Contains("Password=", StringComparison.OrdinalIgnoreCase) ? "Filename=***;Password=***;" : cs;
            DebugLog("PushSlimGameResultsToStream", "connection string attempt", new Dictionary<string, object?> { ["connectionStringMasked"] = maskedCs, ["csLength"] = cs.Length }, "H4");
            // #endregion
            try
            {
                // #region agent log
                DebugLog("PushSlimGameResultsToStream", "before LiteDatabase ctor", new Dictionary<string, object?> { ["filenameInCs"] = dbPath }, "H5");
                // #endregion
                using var db = new LiteDatabase(cs);
                var col = db.GetCollection(collectionName);
                int written = 0;

                foreach (var doc in col.FindAll())
                {
                    if (!TryGetSerializedStoredItem(doc, out var storedJson) || string.IsNullOrWhiteSpace(storedJson))
                        continue;
                    if (!TryBuildSlimSummary(storedJson!, out var summaryJson))
                        continue;

                    redisDb.StreamAdd(streamKey, "payload", summaryJson);
                    written++;
                }

                return written;
            }
            catch (Exception ex)
            {
                // #region agent log
                DebugLog("PushSlimGameResultsToStream", "LiteDB open failed", new Dictionary<string, object?> { ["message"] = ex.Message, ["connectionStringMasked"] = (cs.Contains("Password=", StringComparison.OrdinalIgnoreCase) ? "Filename=***;Password=***;" : cs) }, "H5");
                // #endregion
                Console.WriteLine($"LiteDB open failed: {ex.Message}");
            }
        }

        return 0;
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
            if (!root.TryGetProperty("Teams", out var teamsEl)) return false;
            if (!root.TryGetProperty("Statistics", out var matchStatsEl)) return false;
            if (!matchStatsEl.TryGetProperty("Result", out var resultEl)) return false;
            if (!teamsEl.TryGetProperty("Red", out var redTeamEl)) return false;
            if (!teamsEl.TryGetProperty("Blue", out var blueTeamEl)) return false;

            string? redTeamId = TryGetString(redTeamEl, "Id");
            string? blueTeamId = TryGetString(blueTeamEl, "Id");
            int? redScore = TryGetInt(redTeamEl, "Score");
            int? blueScore = TryGetInt(blueTeamEl, "Score");

            string? winTeamId = null;
            if (resultEl.TryGetProperty("WinTeamIds", out var winIdsEl) &&
                winIdsEl.ValueKind == STJ.JsonValueKind.Array &&
                winIdsEl.GetArrayLength() > 0)
                winTeamId = winIdsEl[0].GetString();

            int? resultType = TryGetInt(resultEl, "ResultType");
            string winSide =
                (winTeamId != null && redTeamId != null && winTeamId.Equals(redTeamId, StringComparison.OrdinalIgnoreCase)) ? "Red" :
                (winTeamId != null && blueTeamId != null && winTeamId.Equals(blueTeamId, StringComparison.OrdinalIgnoreCase)) ? "Blue" :
                "Unknown";

            string? matchId = TryGetString(root, "Id");
            string? matchName = TryGetString(root, "Name");
            string? launchTime = TryGetString(root, "LaunchTime");
            string? finishTime = TryGetString(root, "FinishTime");
            double? durationSeconds = null;
            if (DateTimeOffset.TryParse(launchTime, out var lt) && DateTimeOffset.TryParse(finishTime, out var ft))
                durationSeconds = (ft - lt).TotalSeconds;

            var idToName = new Dictionary<int, string>();
            var redPlayers = ExtractSlimPlayers(redTeamEl, idToName);
            var bluePlayers = ExtractSlimPlayers(blueTeamEl, idToName);

            object? firstBloodObj = null;
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

            var summary = new
            {
                Id = matchId,
                Name = matchName,
                LaunchTime = launchTime,
                FinishTime = finishTime,
                DurationSeconds = durationSeconds,
                Teams = new
                {
                    Red = new { Id = redTeamId, Score = redScore, Players = redPlayers },
                    Blue = new { Id = blueTeamId, Score = blueScore, Players = bluePlayers }
                },
                Result = new { WinTeamId = winTeamId, WinSide = winSide, ResultType = resultType },
                FirstBlood = firstBloodObj
            };

            summaryJson = STJ.JsonSerializer.Serialize(summary);
            return true;
        }
        catch (STJ.JsonException)
        {
            return false;
        }
    }

    private static List<object> ExtractSlimPlayers(STJ.JsonElement teamEl, Dictionary<int, string> idToName)
    {
        var list = new List<object>();
        if (!teamEl.TryGetProperty("Players", out var playersEl) || playersEl.ValueKind != STJ.JsonValueKind.Array)
            return list;

        foreach (var pEl in playersEl.EnumerateArray())
        {
            int? playerId = null;
            string? playerName = null;
            if (pEl.TryGetProperty("Context", out var ctxEl) &&
                ctxEl.TryGetProperty("Info", out var infoEl) &&
                infoEl.ValueKind == STJ.JsonValueKind.Object)
            {
                playerId = TryGetInt(infoEl, "Id");
                playerName = TryGetString(infoEl, "Name");
            }
            if (string.IsNullOrWhiteSpace(playerName) &&
                pEl.TryGetProperty("Entity", out var entityEl) &&
                entityEl.ValueKind == STJ.JsonValueKind.Object)
                playerName = TryGetString(entityEl, "PlayerName");

            if (playerId.HasValue && !string.IsNullOrWhiteSpace(playerName))
                idToName[playerId.Value] = playerName!;

            int kills = 0, deaths = 0, shots = 0, hits = 0, score = 0;
            double damage = 0;
            int fatalHits = 0;
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
                                fatalHits++;
                        }
                    }
                    maxConsecutiveKills = MaxNullable(maxConsecutiveKills, TryGetInt(stEl, "MaxConsecutiveKills"));
                    if (stEl.TryGetProperty("MedalsMap", out var medalsEl) && medalsEl.ValueKind == STJ.JsonValueKind.Object)
                    {
                        medals ??= new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
                        foreach (var prop in medalsEl.EnumerateObject())
                        {
                            if (prop.Value.ValueKind == STJ.JsonValueKind.Number && prop.Value.TryGetInt32(out var mv))
                                medals[prop.Name] = (medals.TryGetValue(prop.Name, out var cur) ? cur : 0) + mv;
                        }
                    }
                }
            }

            double? accuracy = shots > 0 ? (double)hits / shots : null;
            double? kd = deaths > 0 ? (double)kills / deaths : null;
            list.Add(new
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
            });
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

    /// <summary>ref와 동일: 패스워드 없으면 Filename= 경로 하나만 사용. ReadOnly=true 로 파일 잠금 방지(다른 프로세스가 동일 DB 사용 가능).</summary>
    private static IEnumerable<string> BuildConnectionStrings(string dbPath, string? password)
    {
        const string readOnly = "ReadOnly=true";
        if (!string.IsNullOrEmpty(password))
        {
            yield return $"Filename={dbPath};Password={password};{readOnly}";
            yield return $"Filename={dbPath};{readOnly}";
            yield break;
        }
        yield return $"Filename={dbPath};{readOnly}";
    }

    /// <summary>.env에서 읽은 경로의 따옴표/공백 제거. ref처럼 순수 파일 경로로만 열기 위함.</summary>
    private static string? NormalizePath(string? path)
    {
        if (string.IsNullOrWhiteSpace(path)) return null;
        path = path!.Trim();
        if (path.Length >= 2 && path[0] == '"' && path[path.Length - 1] == '"')
            path = path.Substring(1, path.Length - 2).Trim();
        return string.IsNullOrWhiteSpace(path) ? null : path;
    }

    private static string MaskRedisUrl(string url)
    {
        try
        {
            var u = new Uri(url);
            if (!string.IsNullOrEmpty(u.UserInfo))
                return new UriBuilder(u) { UserName = "***", Password = "" }.Uri.ToString();
            return url;
        }
        catch { return "***"; }
    }
}

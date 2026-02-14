using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
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
        private const int DefaultGuestApiPort = 5099;

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

            string? playerDbPath = Environment.GetEnvironmentVariable("LITEDB_PLAYER_PATH")?.Trim();
            if (!string.IsNullOrWhiteSpace(playerDbPath))
            {
                CleanupExpiredGuests(playerDbPath);
                int guestPort = int.TryParse(Environment.GetEnvironmentVariable("GUEST_API_PORT"), out var p) ? p : DefaultGuestApiPort;
                var guestApiThread = new Thread(() => RunGuestApiLoop(playerDbPath, guestPort))
                {
                    IsBackground = true,
                    Name = "GuestApi"
                };
                guestApiThread.Start();
                Console.WriteLine($"[게스트 API] http://127.0.0.1:{guestPort}/internal/guest (LiteDB player: {playerDbPath})");
            }

            string? passwordRaw = Environment.GetEnvironmentVariable("LITEDB_PASSWORD");
            string? password = string.IsNullOrWhiteSpace(passwordRaw) ? null : passwordRaw.Trim();
            string streamKey = Environment.GetEnvironmentVariable("INGEST_STREAM_KEY") ?? DefaultStreamKey;
            string collectionName = Environment.GetEnvironmentVariable("GAME_COLLECTION_NAME") ?? DefaultCollectionName;
            int pollMs = int.TryParse(Environment.GetEnvironmentVariable("POLL_INTERVAL_MS"), out var ms) ? ms : DefaultPollIntervalMs;

            Console.WriteLine($"[경기 수집] Redis: {RedisConnection}, 스트림: {streamKey}");
            Console.WriteLine($"[경기 수집] LiteDB(경기 DB): {dbPath}, 폴링 간격: {pollMs}ms");
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
                                Console.WriteLine($"[{DateTime.Now:HH:mm:ss}] 경기 {written}건 스트림 전송 완료");
                            lastSize = currentSize;
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[{DateTime.Now:HH:mm:ss}] 오류: {ex.Message}");
                    }

                    Thread.Sleep(pollMs);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"치명적 오류: {ex.Message}");
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
                        if (TryGetIdAndFinishTimeFromStored(storedJson!, out var earlyId, out var finishTime) &&
                            string.IsNullOrWhiteSpace(finishTime))
                        {
                            if (!string.IsNullOrWhiteSpace(earlyId))
                                Console.WriteLine($"[경기 수집] 경기 중 (FinishTime 없음), 스킵: Id={earlyId}");
                            continue;
                        }
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
                    Console.WriteLine($"[경기 수집] LiteDB 열기 실패: {ex.Message}");
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

        /// <summary>저장된 경기 JSON에서 Id와 FinishTime만 빠르게 읽음. 경기 중(FinishTime 없음) 판별용.</summary>
        private static bool TryGetIdAndFinishTimeFromStored(string storedJson, out string? id, out string? finishTime)
        {
            id = null;
            finishTime = null;
            try
            {
                using var j = STJ.JsonDocument.Parse(storedJson);
                var root = j.RootElement;
                if (root.ValueKind != STJ.JsonValueKind.Object) return false;
                id = GetString(root, "Id");
                finishTime = GetString(root, "FinishTime");
                return true;
            }
            catch { return false; }
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

        // ────────────────────────────────────────────────────────────────────
        // 슬림 요약 생성 (덤프 코드와 동일한 파싱 경로)
        // ────────────────────────────────────────────────────────────────────

        private static bool TryBuildSlimSummary(string storedJson, out string summaryJson)
        {
            summaryJson = "";

            try
            {
                using var jd = STJ.JsonDocument.Parse(storedJson);
                var root = jd.RootElement;

                if (root.ValueKind != STJ.JsonValueKind.Object) return false;

                // 필수 필드 체크
                var matchId = GetString(root, "Id");
                var launchTime = GetString(root, "LaunchTime");
                if (string.IsNullOrWhiteSpace(matchId) || string.IsNullOrWhiteSpace(launchTime)) return false;
                if (!TryGetObject(root, "Teams", out var teamsObj)) return false;

                // 최소 플레이어 1명
                int totalPlayers = 0;
                foreach (var tp in teamsObj.EnumerateObject())
                {
                    if (TryGetArray(tp.Value, "Players", out var pa))
                        totalPlayers += pa.GetArrayLength();
                }
                if (totalPlayers < 1) return false;

                var matchName = GetString(root, "Name");
                var startTime = GetString(root, "StartTime");
                var finishTime = GetString(root, "FinishTime");

                double? durationSeconds = null;
                if (DateTimeOffset.TryParse(launchTime, out var lt) && DateTimeOffset.TryParse(finishTime, out var ft))
                    durationSeconds = (ft - lt).TotalSeconds;

                // Environment.GameType
                object? environment = BuildEnvironmentSlim(root);

                // Teams (모든 팀 동적 순회)
                var teamsDict = new Dictionary<string, object?>();
                var teamIdByKey = new Dictionary<string, string?>(StringComparer.OrdinalIgnoreCase);

                foreach (var teamProp in teamsObj.EnumerateObject())
                {
                    var teamKey = teamProp.Name;
                    var teamVal = teamProp.Value;

                    if (teamVal.ValueKind != STJ.JsonValueKind.Object)
                    {
                        teamsDict[teamKey] = null;
                        continue;
                    }

                    var teamDict = new Dictionary<string, object?>();
                    teamDict["Score"] = GetNumberOrNull(teamVal, "Score");
                    teamIdByKey[teamKey] = GetString(teamVal, "Id");

                    if (TryGetArray(teamVal, "Players", out var playersArr))
                    {
                        var playersSlim = new List<object?>();
                        foreach (var p in playersArr.EnumerateArray())
                        {
                            if (p.ValueKind != STJ.JsonValueKind.Object)
                            {
                                playersSlim.Add(null);
                                continue;
                            }
                            playersSlim.Add(BuildPlayerSlim(p));
                        }
                        teamDict["Players"] = playersSlim;
                    }
                    else
                    {
                        teamDict["Players"] = Array.Empty<object>();
                    }

                    teamsDict[teamKey] = teamDict;
                }

                // WinSide: Statistics.Result.WinTeamIds → 점수 비교 fallback
                string? winSide = null;

                if (TryGetObject(root, "Statistics", out var matchStats) &&
                    TryGetObject(matchStats, "Result", out var resultEl) &&
                    TryGetArray(resultEl, "WinTeamIds", out var winIds) && winIds.GetArrayLength() > 0)
                {
                    var winTeamId = winIds[0].GetString();
                    foreach (var kv in teamIdByKey)
                    {
                        if (winTeamId != null && kv.Value != null &&
                            winTeamId.Equals(kv.Value, StringComparison.OrdinalIgnoreCase))
                        {
                            winSide = kv.Key;
                            break;
                        }
                    }
                }

                // fallback: 가장 높은 팀 스코어
                if (string.IsNullOrWhiteSpace(winSide))
                {
                    long maxScore = -1;
                    foreach (var tp in teamsObj.EnumerateObject())
                    {
                        var s = GetInt64OrNull(tp.Value, "Score");
                        if (s.HasValue && s.Value > maxScore)
                        {
                            maxScore = s.Value;
                            winSide = tp.Name;
                        }
                    }
                }

                var summary = new Dictionary<string, object?>
                {
                    ["Id"] = matchId,
                    ["Name"] = matchName,
                    ["LaunchTime"] = launchTime,
                    ["StartTime"] = startTime,
                    ["FinishTime"] = finishTime,
                    ["DurationSeconds"] = durationSeconds,
                    ["Environment"] = environment,
                    ["Teams"] = teamsDict,
                    ["WinSide"] = winSide
                };

                var opts = new STJ.JsonSerializerOptions
                {
                    WriteIndented = false,
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
                };
                summaryJson = STJ.JsonSerializer.Serialize(summary, opts);
                return true;
            }
            catch (STJ.JsonException)
            {
                return false;
            }
        }

        private static object? BuildEnvironmentSlim(STJ.JsonElement root)
        {
            if (!TryGetObject(root, "Environment", out var env)) return null;
            if (!TryGetObject(env, "GameType", out var gt)) return null;

            return new Dictionary<string, object?>
            {
                ["GameType"] = new Dictionary<string, object?>
                {
                    ["Id"] = GetString(gt, "Id"),
                    ["Name"] = GetString(gt, "Name")
                }
            };
        }

        /// <summary>
        /// 플레이어 1명의 슬림 오브젝트. 덤프 코드 BuildPlayerSlim과 동일 경로.
        /// Entity.PlayerName / Context.DeviceId / Context.Sessions[0].Statistics
        /// </summary>
        private static object? BuildPlayerSlim(STJ.JsonElement player)
        {
            // Entity.PlayerName
            string? playerName = null;
            if (TryGetObject(player, "Entity", out var entity))
                playerName = GetString(entity, "PlayerName");

            long? deviceId = null;
            long? preconfId = null;
            var statsSlim = new Dictionary<string, object?>();

            if (TryGetObject(player, "Context", out var ctx))
            {
                deviceId = GetInt64OrNull(ctx, "DeviceId");
                preconfId = GetInt64OrNull(ctx, "PreconfiguredDeviceId");

                // Sessions[0].Statistics
                if (TryGetArray(ctx, "Sessions", out var sessionsArr) && sessionsArr.GetArrayLength() > 0)
                {
                    var s0 = sessionsArr[0];
                    if (TryGetObject(s0, "Statistics", out var st))
                    {
                        // 스칼라 통계
                        statsSlim["Score"] = GetNumberOrNull(st, "Score");
                        statsSlim["Deaths"] = GetNumberOrNull(st, "Deaths");
                        statsSlim["Shots"] = GetNumberOrNull(st, "Shots");
                        statsSlim["ConsecutiveKills"] = GetNumberOrNull(st, "ConsecutiveKills");
                        statsSlim["MaxConsecutiveKills"] = GetNumberOrNull(st, "MaxConsecutiveKills");
                        statsSlim["ConsecutiveDeaths"] = GetNumberOrNull(st, "ConsecutiveDeaths");
                        statsSlim["NemesisPlayerId"] = GetNumberOrNull(st, "NemesisPlayerId");

                        // _killings → Kills (배열 길이)
                        if (TryGetArray(st, "_killings", out var killings))
                            statsSlim["Kills"] = killings.GetArrayLength();
                        else
                            statsSlim["Kills"] = null;

                        // OutHitsList → Hits / TotalDamage / FatalHits
                        if (TryGetArray(st, "OutHitsList", out var hitsList))
                        {
                            int hits = hitsList.GetArrayLength();
                            double totalDamage = 0;
                            int fatalHits = 0;

                            foreach (var h in hitsList.EnumerateArray())
                            {
                                if (h.ValueKind != STJ.JsonValueKind.Object) continue;

                                var dmg = GetDoubleOrNull(h, "Damage");
                                if (dmg.HasValue) totalDamage += dmg.Value;

                                var isFatal = GetBoolOrNull(h, "IsFatalDamage");
                                if (isFatal == true) fatalHits++;
                            }

                            statsSlim["Hits"] = hits;
                            statsSlim["TotalDamage"] = totalDamage;
                            statsSlim["FatalHits"] = fatalHits;
                        }
                        else
                        {
                            statsSlim["Hits"] = null;
                            statsSlim["TotalDamage"] = null;
                            statsSlim["FatalHits"] = null;
                        }
                    }
                }
            }

            return new Dictionary<string, object?>
            {
                ["PlayerName"] = playerName,
                ["DeviceId"] = deviceId,
                ["PreconfiguredDeviceId"] = preconfId,
                ["Statistics"] = statsSlim
            };
        }

        // ────────────────────────────────────────────────────────────────────
        // JSON 헬퍼 (덤프 코드와 동일)
        // ────────────────────────────────────────────────────────────────────

        private static bool TryGetObject(STJ.JsonElement obj, string prop, out STJ.JsonElement value)
        {
            value = default;
            if (obj.ValueKind != STJ.JsonValueKind.Object) return false;
            if (!obj.TryGetProperty(prop, out value)) return false;
            return value.ValueKind == STJ.JsonValueKind.Object;
        }

        private static bool TryGetArray(STJ.JsonElement obj, string prop, out STJ.JsonElement value)
        {
            value = default;
            if (obj.ValueKind != STJ.JsonValueKind.Object) return false;
            if (!obj.TryGetProperty(prop, out value)) return false;
            return value.ValueKind == STJ.JsonValueKind.Array;
        }

        private static string? GetString(STJ.JsonElement obj, string prop)
        {
            if (obj.ValueKind != STJ.JsonValueKind.Object) return null;
            if (!obj.TryGetProperty(prop, out var p)) return null;
            if (p.ValueKind == STJ.JsonValueKind.String) return p.GetString();
            if (p.ValueKind == STJ.JsonValueKind.Null) return null;
            return p.GetRawText();
        }

        private static object? GetNumberOrNull(STJ.JsonElement obj, string prop)
        {
            if (obj.ValueKind != STJ.JsonValueKind.Object) return null;
            if (!obj.TryGetProperty(prop, out var p)) return null;
            if (p.ValueKind == STJ.JsonValueKind.Number)
            {
                if (p.TryGetInt64(out var i)) return i;
                if (p.TryGetDouble(out var d)) return d;
                return p.GetRawText();
            }
            if (p.ValueKind == STJ.JsonValueKind.Null) return null;
            return null;
        }

        private static long? GetInt64OrNull(STJ.JsonElement obj, string prop)
        {
            if (obj.ValueKind != STJ.JsonValueKind.Object) return null;
            if (!obj.TryGetProperty(prop, out var p)) return null;
            if (p.ValueKind != STJ.JsonValueKind.Number) return null;
            return p.TryGetInt64(out var v) ? v : null;
        }

        private static double? GetDoubleOrNull(STJ.JsonElement obj, string prop)
        {
            if (obj.ValueKind != STJ.JsonValueKind.Object) return null;
            if (!obj.TryGetProperty(prop, out var p)) return null;
            if (p.ValueKind != STJ.JsonValueKind.Number) return null;
            return p.TryGetDouble(out var v) ? v : null;
        }

        private static bool? GetBoolOrNull(STJ.JsonElement obj, string prop)
        {
            if (obj.ValueKind != STJ.JsonValueKind.Object) return null;
            if (!obj.TryGetProperty(prop, out var p)) return null;
            if (p.ValueKind == STJ.JsonValueKind.True) return true;
            if (p.ValueKind == STJ.JsonValueKind.False) return false;
            return null;
        }

        /// <summary>LITEDB_PLAYER_PATH의 player 컬렉션에서 Kind==Guest, CreatedAt>=2026, 7일 경과한 문서 삭제.</summary>
        private static void CleanupExpiredGuests(string playerDbPath)
        {
            if (!File.Exists(playerDbPath))
                return;
            try
            {
                var cutoff = DateTime.UtcNow.AddDays(-7);
                var year2026 = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);
                using var db = new LiteDatabase($"Filename={playerDbPath};");
                var col = db.GetCollection("player");
                var toDelete = col.Find(Query.And(
                    Query.And(Query.EQ("Kind", "Guest"), Query.GTE("CreatedAt", year2026)),
                    Query.LT("CreatedAt", cutoff)
                )).ToList();
                foreach (var doc in toDelete)
                {
                    var id = doc["_id"];
                    col.Delete(id);
                    Console.WriteLine($"[게스트 정리] 삭제 _id={id}");
                }
                if (toDelete.Count > 0)
                    Console.WriteLine($"[게스트 정리] 7일 경과 게스트 {toDelete.Count}건 삭제 완료");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[게스트 정리] 오류: {ex.Message}");
            }
        }

        private static void RunGuestApiLoop(string playerDbPath, int port)
        {
            var prefix = $"http://127.0.0.1:{port}/";
            try
            {
                using var listener = new HttpListener();
                listener.Prefixes.Add(prefix);
                listener.Start();
                while (true)
                {
                    var ctx = listener.GetContext();
                    try
                    {
                        if (ctx.Request.HttpMethod == "POST" &&
                            ctx.Request.Url?.AbsolutePath.TrimEnd('/').EndsWith("/internal/guest", StringComparison.OrdinalIgnoreCase) == true)
                        {
                            using var reader = new StreamReader(ctx.Request.InputStream, ctx.Request.ContentEncoding);
                            var body = reader.ReadToEnd();
                            string? nickname = null;
                            if (!string.IsNullOrWhiteSpace(body))
                            {
                                using var doc = STJ.JsonDocument.Parse(body);
                                if (doc.RootElement.TryGetProperty("nickname", out var prop))
                                    nickname = prop.GetString()?.Trim();
                            }
                            if (string.IsNullOrEmpty(nickname))
                            {
                                ctx.Response.StatusCode = 400;
                                WriteJson(ctx.Response, new { error = "nickname required" });
                                continue;
                            }
                            var id = AddGuestInPlayerDb(playerDbPath, nickname);
                            ctx.Response.StatusCode = 200;
                            WriteJson(ctx.Response, new { id });
                        }
                        else
                        {
                            ctx.Response.StatusCode = 404;
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[게스트 API] 오류: {ex.Message}");
                        ctx.Response.StatusCode = 500;
                        WriteJson(ctx.Response, new { error = ex.Message });
                    }
                    finally
                    {
                        ctx.Response.Close();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[게스트 API] 리스너 오류: {ex.Message}");
            }
        }

        private static void WriteJson(HttpListenerResponse response, object obj)
        {
            response.ContentType = "application/json; charset=utf-8";
            var json = STJ.JsonSerializer.Serialize(obj);
            var bytes = Encoding.UTF8.GetBytes(json);
            response.ContentLength64 = bytes.Length;
            response.OutputStream.Write(bytes, 0, bytes.Length);
        }

        /// <summary>player 컬렉션에 게스트 추가. 기존 음수 ID Min()-1 로 새 ID 부여.</summary>
        private static int AddGuestInPlayerDb(string playerDbPath, string nickname)
        {
            using var db = new LiteDatabase($"Filename={playerDbPath};");
            var col = db.GetCollection("player");
            var ids = col.FindAll()
                .Select(d => d["_id"].AsInt32)
                .Where(x => x < 0)
                .ToList();
            int newId = ids.Count > 0 ? ids.Min() - 1 : -1;
            var now = DateTime.UtcNow;

            var doc = new BsonDocument
            {
                ["_id"] = newId,
                ["Kind"] = "Guest",
                ["Nickname"] = nickname,
                ["FullName"] = nickname,
                ["FirstName"] = nickname,
                ["LastName"] = BsonValue.Null,
                ["CreatedAt"] = now,
                ["RegisteredAt"] = now,
                ["Wins"] = 0,
                ["Loses"] = 0,
                ["TotalGames"] = 0,
                ["Kills"] = 0,
                ["Deaths"] = 0,
                ["KillsToDeath"] = 0.0,
                ["Accuracy"] = 0
            };

            var profile = new Dictionary<string, object?>
            {
                ["FirstName"] = nickname,
                ["LastName"] = "",
                ["CreatedAt"] = DateTime.SpecifyKind(now, DateTimeKind.Utc).ToLocalTime().ToString("o"),
                ["RegisteredAt"] = DateTime.SpecifyKind(now, DateTimeKind.Utc).ToLocalTime().ToString("o"),
                ["Nickname"] = nickname,
                ["IsMale"] = true,
                ["ZipCode"] = null,
                ["AvatarUrl"] = null
            };
            var stats = new Dictionary<string, object?>
            {
                ["Wins"] = 0, ["Loses"] = 0, ["Kills"] = 0, ["Deaths"] = 0, ["Shots"] = 0, ["OutHits"] = 0,
                ["TotalGames"] = 0, ["MaxConsecutiveKills"] = 0, ["BattleCoinsSpent"] = 0, ["KillsToDeath"] = 0.0, ["Accuracy"] = 0
            };
            var stored = new Dictionary<string, object?>
            {
                ["Id"] = newId,
                ["Kind"] = 0,
                ["Profile"] = profile,
                ["Statistics"] = stats
            };
            doc["SerializedStoredItem"] = STJ.JsonSerializer.Serialize(stored);
            col.Insert(doc);
            return newId;
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
            Console.WriteLine("경기 수집 브릿지 (LiteDB → Redis 스트림)");
            Console.WriteLine("  dotnet run -- \"<arena.data 경로>\"");
            Console.WriteLine("  또는 .env에 LITEDB_ARENA_PATH 설정 후 인자 없이 실행");
        }
    }
}

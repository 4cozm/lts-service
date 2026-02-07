using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using LiteDB;

// System.Text.Json만 명시적으로 사용 (LiteDB.JsonSerializer 충돌 방지)
using STJ = System.Text.Json;

namespace LiteDbV2Dump
{
    internal static class Program
    {
        // 사용:
        //   dotnet run -- "<dbFilePath>"
        //   dotnet run -- "<dbFilePath>" "<password>"
        //   dotnet run -- "<dbFilePath>" "<password-or-empty>" "<outputDir>"
        //
        // 출력:
        //   <outDir>/game_results.jsonl  (슬림 결과 + 플레이어 세부지표)
        private static int Main(string[] args)
        {
            Console.OutputEncoding = Encoding.UTF8;

            if (args.Length < 1)
            {
                PrintUsage();
                return 2;
            }

            string dbPath = args[0];
            string? passwordArg = args.Length >= 2 ? args[1] : null;
            string outDir = args.Length >= 3 ? args[2] : Path.Combine(Environment.CurrentDirectory, "dump");

            if (string.IsNullOrWhiteSpace(dbPath))
            {
                Console.WriteLine("DB path is empty.");
                return 2;
            }

            if (!File.Exists(dbPath))
            {
                Console.WriteLine("DB file not found:");
                Console.WriteLine(dbPath);
                return 2;
            }

            Directory.CreateDirectory(outDir);

            string? password = string.IsNullOrWhiteSpace(passwordArg) ? null : passwordArg;

            Exception? last = null;

            foreach (var cs in BuildConnectionStrings(dbPath, password))
            {
                Console.WriteLine($"Try open: {MaskPassword(cs)}");

                try
                {
                    using (var db = new LiteDatabase(cs))
                    {
                        Console.WriteLine("✅ Opened LiteDB successfully.");
                        DumpSlimGameResults(db, "game", outDir);
                        Console.WriteLine("✅ Done. Output: " + outDir);
                        return 0;
                    }
                }
                catch (Exception ex)
                {
                    last = ex;
                    Console.WriteLine("❌ Open failed: " + ex.Message);
                    Console.WriteLine();
                }
            }

            Console.WriteLine("All attempts failed.");
            if (last != null)
            {
                Console.WriteLine("Last error detail:");
                Console.WriteLine(last);
            }

            return 1;
        }

        private static void DumpSlimGameResults(LiteDatabase db, string collectionName, string outDir)
        {
            var col = db.GetCollection(collectionName);

            string outPath = Path.Combine(outDir, "game_results.jsonl");
            using var sw = new StreamWriter(outPath, false, new UTF8Encoding(false));

            int processed = 0, written = 0, skipped = 0;

            foreach (var doc in col.FindAll())
            {
                processed++;

                if (!TryGetSerializedStoredItem(doc, out var storedJson) || string.IsNullOrWhiteSpace(storedJson))
                {
                    skipped++;
                    continue;
                }

                if (!TryBuildSlimSummary(storedJson!, out var summaryJson))
                {
                    skipped++;
                    continue;
                }

                sw.WriteLine(summaryJson);
                written++;

                if (written % 1000 == 0)
                    Console.WriteLine($"[game] wrote {written} results...");
            }

            Console.WriteLine();
            Console.WriteLine($"✅ [game] processed={processed}, written={written}, skipped={skipped}");
            Console.WriteLine($"✅ output -> {Path.GetFileName(outPath)}");
        }

        private static bool TryGetSerializedStoredItem(BsonDocument doc, out string? storedJson)
        {
            storedJson = null;

            if (doc.ContainsKey("SerializedStoredItem") && doc["SerializedStoredItem"].IsString)
            {
                storedJson = doc["SerializedStoredItem"].AsString;
                return true;
            }

            // 방어: 큰 문자열 필드(Serialized/Stored/Data/Payload/Item) 중 가장 큰 것 선택
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

                // 필수: Teams / Statistics.Result
                if (!root.TryGetProperty("Teams", out var teamsEl)) return false;
                if (!root.TryGetProperty("Statistics", out var matchStatsEl)) return false;
                if (!matchStatsEl.TryGetProperty("Result", out var resultEl)) return false;

                if (!teamsEl.TryGetProperty("Red", out var redTeamEl)) return false;
                if (!teamsEl.TryGetProperty("Blue", out var blueTeamEl)) return false;

                // 팀 스코어/아이디
                string? redTeamId = TryGetString(redTeamEl, "Id");
                string? blueTeamId = TryGetString(blueTeamEl, "Id");
                int? redScore = TryGetInt(redTeamEl, "Score");
                int? blueScore = TryGetInt(blueTeamEl, "Score");

                // 승리팀
                string? winTeamId = null;
                if (resultEl.TryGetProperty("WinTeamIds", out var winIdsEl) &&
                    winIdsEl.ValueKind == STJ.JsonValueKind.Array &&
                    winIdsEl.GetArrayLength() > 0)
                {
                    winTeamId = winIdsEl[0].GetString();
                }

                int? resultType = TryGetInt(resultEl, "ResultType");

                string winSide =
                    (winTeamId != null && redTeamId != null && winTeamId.Equals(redTeamId, StringComparison.OrdinalIgnoreCase)) ? "Red" :
                    (winTeamId != null && blueTeamId != null && winTeamId.Equals(blueTeamId, StringComparison.OrdinalIgnoreCase)) ? "Blue" :
                    "Unknown";

                // 매치 메타
                string? matchId = TryGetString(root, "Id");
                string? matchName = TryGetString(root, "Name");
                string? launchTime = TryGetString(root, "LaunchTime");
                string? finishTime = TryGetString(root, "FinishTime");

                double? durationSeconds = null;
                if (DateTimeOffset.TryParse(launchTime, out var lt) && DateTimeOffset.TryParse(finishTime, out var ft))
                    durationSeconds = (ft - lt).TotalSeconds;

                // FirstBlood 이름 매핑 위해 id->name 맵 만들면서 플레이어 추출
                var idToName = new Dictionary<int, string>();
                var redPlayers = ExtractSlimPlayers(redTeamEl, "Red", idToName);
                var bluePlayers = ExtractSlimPlayers(blueTeamEl, "Blue", idToName);

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

                // ✅ 슬림 스키마 (Environment/Field/Experience/Consecutive* 제거)
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

                    Result = new
                    {
                        WinTeamId = winTeamId,
                        WinSide = winSide,
                        ResultType = resultType
                    },

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

        private static List<object> ExtractSlimPlayers(STJ.JsonElement teamEl, string side, Dictionary<int, string> idToName)
        {
            var list = new List<object>();

            if (!teamEl.TryGetProperty("Players", out var playersEl) || playersEl.ValueKind != STJ.JsonValueKind.Array)
                return list;

            foreach (var pEl in playersEl.EnumerateArray())
            {
                // 식별
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
                {
                    playerName = TryGetString(entityEl, "PlayerName");
                }

                if (playerId.HasValue && !string.IsNullOrWhiteSpace(playerName))
                    idToName[playerId.Value] = playerName!;

                // 집계
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

                        // ✅ 플레이어 Score는 필요(킬과 다를 수 있음)
                        score += TryGetInt(stEl, "Score") ?? 0;

                        // kills: _killings 배열 길이
                        if (stEl.TryGetProperty("_killings", out var kEl) && kEl.ValueKind == STJ.JsonValueKind.Array)
                            kills += kEl.GetArrayLength();

                        // hits/damage/fatal
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

                        // ✅ MaxConsecutiveKills만 유지
                        maxConsecutiveKills = MaxNullable(maxConsecutiveKills, TryGetInt(stEl, "MaxConsecutiveKills"));

                        // ✅ Medals 유지
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
                double? kd = (deaths > 0) ? (double)kills / deaths : (double?)null; // deaths=0은 JSON 안전 위해 null

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

        private static string MaskPassword(string cs)
        {
            int idx = cs.IndexOf("Password=", StringComparison.OrdinalIgnoreCase);
            if (idx < 0) return cs;

            int end = cs.IndexOf(';', idx);
            if (end < 0) end = cs.Length;

            string before = cs.Substring(0, idx);
            string after = cs.Substring(end);
            return before + "Password=***" + after;
        }

        private static void PrintUsage()
        {
            Console.WriteLine("LiteDbV2Dump (LiteDB v2) - slim game results");
            Console.WriteLine();
            Console.WriteLine(@"Usage:");
            Console.WriteLine(@"  dotnet run -- ""<dbFilePath>""");
            Console.WriteLine(@"  dotnet run -- ""<dbFilePath>"" ""<password>""");
            Console.WriteLine(@"  dotnet run -- ""<dbFilePath>"" ""<password-or-empty>"" ""<outputDir>""");
        }
    }
}

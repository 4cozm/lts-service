using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;

// 충돌 방지: 두 JsonSerializer를 별칭으로 분리
using STJ = System.Text.Json.JsonSerializer;
using LdbJson = LiteDB.JsonSerializer;

using LiteDB;

namespace LiteDbV2Tool
{
    internal static class Program
    {
        // dotnet run -- watch "<dbPath>" [intervalMs]
        // dotnet run -- set "<dbPath>" <id> <field> <value...>
        // dotnet run -- rebuild "<dbPath>"
        private static int Main(string[] args)
        {
            Console.OutputEncoding = Encoding.UTF8;

            if (args.Length < 2)
            {
                PrintUsage();
                return 2;
            }

            var cmd = (args[0] ?? "").Trim().ToLowerInvariant();
            var dbPath = args[1];

            if (!File.Exists(dbPath))
            {
                Console.WriteLine("DB file not found:");
                Console.WriteLine(dbPath);
                return 2;
            }

            try
            {
                switch (cmd)
                {
                    case "watch":
                    {
                        int intervalMs = (args.Length >= 3 && int.TryParse(args[2], out var ms)) ? ms : 1500;
                        Watch(dbPath, intervalMs);
                        return 0;
                    }
                    case "set":
                    {
                        if (args.Length < 5)
                        {
                            Console.WriteLine("set needs: <dbPath> <id> <field> <value...>");
                            return 2;
                        }

                        if (!int.TryParse(args[2], out var id))
                        {
                            Console.WriteLine("Invalid id: " + args[2]);
                            return 2;
                        }

                        var field = args[3];
                        var value = string.Join(" ", args.Skip(4));

                        SetField(dbPath, id, field, value);
                        return 0;
                    }
                    case "add":
                    {
                        if (args.Length < 3)
                        {
                            Console.WriteLine(@"add needs: <dbPath> <nickname>");
                            Console.WriteLine(@"ex) dotnet run -- add ""C:\...\players.data"" ""NewGuy""");
                            return 2;
                        }

                        var nickname = string.Join(" ", args.Skip(2));
                        AddGuest(dbPath, nickname);
                        return 0;
                    }                    
                    case "delete":
                    {
                        if (args.Length < 3 || !int.TryParse(args[2], out var id))
                        {
                            Console.WriteLine(@"delete needs: <dbPath> <id>");
                            return 2;
                        }

                        DeleteUser(dbPath, id);
                        return 0;
                    }
                    case "rebuild":
                    {
                        RebuildTopLevelFromSerialized(dbPath);
                        return 0;
                    }
                    default:
                        Console.WriteLine("Unknown cmd: " + cmd);
                        PrintUsage();
                        return 2;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Fatal: " + ex);
                return 99;
            }
        }

        // ===== LiteDB v2 open =====
        private static LiteDatabase Open(string dbPath)
        {
            // v2 connection string
            return new LiteDatabase($"Filename={dbPath};");
        }

        // ===== WATCH =====
        private static void Watch(string dbPath, int intervalMs)
        {
            Console.WriteLine($"Watching: {dbPath}");
            Console.WriteLine($"Interval: {intervalMs}ms");
            Console.WriteLine("Press Ctrl+C to stop.\n");

            var last = new Dictionary<int, int>();

            while (true)
            {
                try
                {
                    using (var db = Open(dbPath))
                    {
                        var col = db.GetCollection("player");
                        var docs = col.FindAll().ToList();

                        foreach (var doc in docs)
                        {
                            int id = GetInt(doc, "_id", 0);
                            int h = HashKeyFields(doc);

                            if (!last.TryGetValue(id, out var old) || old != h)
                            {
                                last[id] = h;
                                PrintPlayerLine(doc);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("[watch] read failed: " + ex.Message);
                }

                System.Threading.Thread.Sleep(intervalMs);
            }
        }
        
        private static void DeleteUser(string dbPath, int id)
        {
            using (var db = Open(dbPath))
            {
                var col = db.GetCollection("player");

                var ok = col.Delete(new BsonValue(id));

                if (ok)
                {
                    Console.WriteLine($"🗑️ Deleted user _id={id}");
                }
                else
                {
                    Console.WriteLine($"❌ No such _id: {id}");
                }
            }
        }
        private static void AddGuest(string dbPath, string nicknameRaw)
{
    var nickname = TrimQuotes(nicknameRaw);

    using (var db = Open(dbPath))
    {
        var col = db.GetCollection("player");

        // 새 _id 생성: 가장 작은(가장 음수) id에서 -1
        int newId = -1;
        var ids = col.FindAll()
                     .Select(d => GetInt(d, "_id", 0))
                     .Where(x => x < 0)
                     .ToList();

        if (ids.Count > 0)
        {
            newId = ids.Min() - 1; // 예: -109가 최소면 -110
        }

        var now = DateTime.UtcNow;

        // 최상위 문서 생성
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

        // SerializedStoredItem 생성(샘플 구조를 그대로 모사)
        // Kind: 샘플에선 Kind=0으로 들어가 있음(Guest=0 추정)
        // Profile.LastName은 ""로 들어가 있으니 그대로 맞춤
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
            ["Wins"] = 0,
            ["Loses"] = 0,
            ["Kills"] = 0,
            ["Deaths"] = 0,
            ["Shots"] = 0,
            ["OutHits"] = 0,
            ["TotalGames"] = 0,
            ["MaxConsecutiveKills"] = 0,
            ["BattleCoinsSpent"] = 0,
            ["KillsToDeath"] = 0.0,
            ["Accuracy"] = 0
        };

        var stored = new Dictionary<string, object?>
        {
            ["Id"] = newId,
            ["Kind"] = 0,
            ["Profile"] = profile,
            ["Statistics"] = stats
        };

        // System.Text.Json으로 문자열 JSON 생성
        var serialized = STJ.Serialize(stored);

        doc["SerializedStoredItem"] = serialized;

        col.Insert(doc);

        Console.WriteLine($"✅ Added Guest: _id={newId}, Nickname={nickname}");
    }
}


        private static int HashKeyFields(BsonDocument doc)
        {
            var nick = GetString(doc, "Nickname", "");
            var wins = GetInt(doc, "Wins", 0);
            var loses = GetInt(doc, "Loses", 0);
            var kills = GetInt(doc, "Kills", 0);
            var deaths = GetInt(doc, "Deaths", 0);
            var total = GetInt(doc, "TotalGames", 0);
            var acc = GetInt(doc, "Accuracy", 0);

            unchecked
            {
                int h = 17;
                h = h * 31 + nick.GetHashCode();
                h = h * 31 + wins;
                h = h * 31 + loses;
                h = h * 31 + kills;
                h = h * 31 + deaths;
                h = h * 31 + total;
                h = h * 31 + acc;
                return h;
            }
        }

        private static void PrintPlayerLine(BsonDocument doc)
        {
            int id = GetInt(doc, "_id", 0);
            var nick = GetString(doc, "Nickname", "");
            int wins = GetInt(doc, "Wins", 0);
            int loses = GetInt(doc, "Loses", 0);
            int kills = GetInt(doc, "Kills", 0);
            int deaths = GetInt(doc, "Deaths", 0);
            int total = GetInt(doc, "TotalGames", 0);
            int acc = GetInt(doc, "Accuracy", 0);

            Console.WriteLine($"[{DateTime.Now:HH:mm:ss}] id={id} nick={nick} W/L={wins}/{loses} K/D={kills}/{deaths} games={total} acc={acc}");
        }

        // ===== SET =====
        private static void SetField(string dbPath, int id, string field, string rawValue)
        {
            using (var db = Open(dbPath))
            {
                var col = db.GetCollection("player");

                // v2: FindById는 BsonValue로도 받을 수 있음
                var doc = col.FindById(new BsonValue(id));
                if (doc == null)
                {
                    Console.WriteLine("No such _id: " + id);
                    return;
                }

                ApplyTopLevelEdit(doc, field, rawValue);

                // SerializedStoredItem도 같이 패치 (가능한 경우에만)
                if (Contains(doc, "SerializedStoredItem"))
                {
                    var serialized = GetString(doc, "SerializedStoredItem", "");
                    var updated = TryPatchSerializedStoredItem(serialized, field, rawValue);
                    if (updated != null)
                    {
                        doc["SerializedStoredItem"] = updated;
                    }
                }

                RecomputeDerived(doc);

                col.Update(doc);

                Console.WriteLine("✅ Updated _id=" + id);
                PrintPlayerLine(doc);
            }
        }

        private static void ApplyTopLevelEdit(BsonDocument doc, string field, string rawValue)
        {
            // 숫자/문자 자동 캐스팅
            switch (field)
            {
                case "_id":
                    throw new InvalidOperationException("_id cannot be edited safely.");

                case "Nickname":
                case "FullName":
                case "FirstName":
                case "LastName":
                case "Kind":
                    doc[field] = TrimQuotes(rawValue);
                    return;

                case "Wins":
                case "Loses":
                case "TotalGames":
                case "Kills":
                case "Deaths":
                case "Accuracy":
                    doc[field] = ParseInt(rawValue);
                    return;

                case "KillsToDeath":
                    doc[field] = (double)ParseFloat(rawValue);
                    return;

                default:
                    // 기존 타입이 숫자면 숫자 파싱 시도
                    if (Contains(doc, field))
                    {
                        var old = doc[field];
                        if (old.IsInt32 || old.IsInt64) { doc[field] = ParseInt(rawValue); return; }
                        if (old.IsDouble) { doc[field] = (double)ParseFloat(rawValue); return; }
                        if (old.IsString) { doc[field] = TrimQuotes(rawValue); return; }
                    }

                    doc[field] = TrimQuotes(rawValue);
                    return;
            }
        }

        private static void RecomputeDerived(BsonDocument doc)
        {
            int kills = GetInt(doc, "Kills", 0);
            int deaths = GetInt(doc, "Deaths", 0);

            int denom = deaths == 0 ? 1 : deaths;
            doc["KillsToDeath"] = (double)((float)kills / denom);
        }

        // ===== SerializedStoredItem patch =====
        private static string? TryPatchSerializedStoredItem(string json, string field, string rawValue)
        {
            if (string.IsNullOrWhiteSpace(json)) return null;

            try
            {
                // System.Text.Json로 파싱/재구성
                // (serialized 내부 구조가 단순해서 Dictionary 방식이 안정적)
                var obj = STJ.Deserialize<Dictionary<string, object?>>(json);
                if (obj == null) return null;

                var profile = ExtractDict(obj, "Profile");
                var stats = ExtractDict(obj, "Statistics");

                switch (field)
                {
                    // Profile
                    case "Nickname":
                        profile["Nickname"] = TrimQuotes(rawValue);
                        obj["Profile"] = profile;
                        break;

                    case "FirstName":
                        profile["FirstName"] = TrimQuotes(rawValue);
                        obj["Profile"] = profile;
                        break;

                    case "LastName":
                        profile["LastName"] = TrimQuotes(rawValue);
                        obj["Profile"] = profile;
                        break;

                    // Statistics
                    case "Wins":
                    case "Loses":
                    case "TotalGames":
                    case "Kills":
                    case "Deaths":
                    case "Accuracy":
                        stats[field] = ParseInt(rawValue);
                        obj["Statistics"] = stats;
                        break;

                    case "KillsToDeath":
                        stats[field] = ParseFloat(rawValue);
                        obj["Statistics"] = stats;
                        break;

                    default:
                        return null; // 모르는 필드는 serialized를 건드리지 않음
                }

                return STJ.Serialize(obj);
            }
            catch
            {
                return null;
            }
        }

        private static Dictionary<string, object?> ExtractDict(Dictionary<string, object?> root, string key)
        {
            if (!root.TryGetValue(key, out var v) || v == null)
                return new Dictionary<string, object?>();

            // v가 JsonElement로 들어올 수 있음
            if (v is JsonElement je)
            {
                if (je.ValueKind == JsonValueKind.Object)
                {
                    var s = je.GetRawText();
                    var d = STJ.Deserialize<Dictionary<string, object?>>(s);
                    return d ?? new Dictionary<string, object?>();
                }

                return new Dictionary<string, object?>();
            }

            // 문자열로 들어오면 다시 파싱
            var txt = v.ToString() ?? "{}";
            var dict = STJ.Deserialize<Dictionary<string, object?>>(txt);
            return dict ?? new Dictionary<string, object?>();
        }

        // ===== rebuild =====
        private static void RebuildTopLevelFromSerialized(string dbPath)
        {
            using (var db = Open(dbPath))
            {
                var col = db.GetCollection("player");
                int changed = 0;

                foreach (var doc in col.FindAll())
                {
                    if (!Contains(doc, "SerializedStoredItem")) continue;

                    var json = GetString(doc, "SerializedStoredItem", "");
                    if (!TryReadStats(json, out var s)) continue;

                    doc["Wins"] = s.Wins;
                    doc["Loses"] = s.Loses;
                    doc["Kills"] = s.Kills;
                    doc["Deaths"] = s.Deaths;
                    doc["TotalGames"] = s.TotalGames;
                    doc["Accuracy"] = s.Accuracy;
                    doc["KillsToDeath"] = (double)s.KillsToDeath;

                    col.Update(doc);
                    changed++;
                }

                Console.WriteLine($"✅ Rebuild done. updated={changed}");
            }
        }

        private static bool TryReadStats(string json, out Stats stats)
        {
            stats = default;

            try
            {
                using var d = JsonDocument.Parse(json);
                if (!d.RootElement.TryGetProperty("Statistics", out var st)) return false;

                stats = new Stats
                {
                    Wins = GetInt(st, "Wins"),
                    Loses = GetInt(st, "Loses"),
                    Kills = GetInt(st, "Kills"),
                    Deaths = GetInt(st, "Deaths"),
                    TotalGames = GetInt(st, "TotalGames"),
                    Accuracy = GetInt(st, "Accuracy"),
                    KillsToDeath = GetFloat(st, "KillsToDeath"),
                };
                return true;
            }
            catch
            {
                return false;
            }
        }

        private static int GetInt(JsonElement obj, string prop)
        {
            return obj.TryGetProperty(prop, out var v) && v.ValueKind == JsonValueKind.Number ? v.GetInt32() : 0;
        }

        private static float GetFloat(JsonElement obj, string prop)
        {
            return obj.TryGetProperty(prop, out var v) && v.ValueKind == JsonValueKind.Number ? v.GetSingle() : 0f;
        }

        private struct Stats
        {
            public int Wins, Loses, Kills, Deaths, TotalGames, Accuracy;
            public float KillsToDeath;
        }

        // ===== LiteDB v2 helpers (TryGetValue 대체) =====
        private static bool Contains(BsonDocument doc, string key)
        {
            // v2에서는 ContainsKey가 있는 쪽이 일반적
            return doc != null && doc.ContainsKey(key);
        }

        private static string GetString(BsonDocument doc, string key, string fallback)
        {
            if (doc == null) return fallback;
            if (!doc.ContainsKey(key)) return fallback;
            var v = doc[key];
            return v.IsString ? v.AsString : (v.RawValue?.ToString() ?? fallback);
        }

        private static int GetInt(BsonDocument doc, string key, int fallback)
        {
            if (doc == null) return fallback;
            if (!doc.ContainsKey(key)) return fallback;
            var v = doc[key];

            if (v.IsInt32) return v.AsInt32;
            if (v.IsInt64) return (int)v.AsInt64;
            if (v.IsDouble) return (int)v.AsDouble;

            // 숫자가 문자열로 들어왔을 때
            if (v.IsString && int.TryParse(v.AsString, out var n)) return n;

            return fallback;
        }

        private static string TrimQuotes(string s)
        {
            s = (s ?? "").Trim();
            if (s.Length >= 2 && s.StartsWith("\"") && s.EndsWith("\""))
                return s.Substring(1, s.Length - 2);
            return s;
        }

        private static int ParseInt(string v)
        {
            v = TrimQuotes(v);
            if (!int.TryParse(v, out var n))
                throw new FormatException("Not an int: " + v);
            return n;
        }

        private static float ParseFloat(string v)
        {
            v = TrimQuotes(v);
            if (!float.TryParse(v, System.Globalization.NumberStyles.Float,
                    System.Globalization.CultureInfo.InvariantCulture, out var f))
                throw new FormatException("Not a float: " + v);
            return f;
        }

        private static void PrintUsage()
        {
            Console.WriteLine("LiteDbV2Tool (LiteDB v2 compatible)");
            Console.WriteLine();
            Console.WriteLine(@"watch:");
            Console.WriteLine(@"  dotnet run -- watch ""<dbPath>"" [intervalMs]");
            Console.WriteLine();
            Console.WriteLine(@"set:");
            Console.WriteLine(@"  dotnet run -- set ""<dbPath>"" <id> <field> <value...>");
            Console.WriteLine(@"  ex) dotnet run -- set ""C:\...\players.data"" -109 Wins 999");
            Console.WriteLine(@"  ex) dotnet run -- set ""C:\...\players.data"" -109 Nickname ""AAA""");
            Console.WriteLine();
            Console.WriteLine(@"rebuild:");
            Console.WriteLine(@"  dotnet run -- rebuild ""<dbPath>""");
        }
    }
}

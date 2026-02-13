import { z } from "zod";
export declare const matchLineSchema: z.ZodObject<{
    Id: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    Name: z.ZodOptional<z.ZodString>;
    LaunchTime: z.ZodOptional<z.ZodString>;
    StartTime: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    FinishTime: z.ZodOptional<z.ZodString>;
    DurationSeconds: z.ZodOptional<z.ZodNumber>;
    Environment: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        GameType: z.ZodOptional<z.ZodObject<{
            Id: z.ZodOptional<z.ZodString>;
            Name: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            Id: z.ZodOptional<z.ZodString>;
            Name: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            Id: z.ZodOptional<z.ZodString>;
            Name: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        GameType: z.ZodOptional<z.ZodObject<{
            Id: z.ZodOptional<z.ZodString>;
            Name: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            Id: z.ZodOptional<z.ZodString>;
            Name: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            Id: z.ZodOptional<z.ZodString>;
            Name: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        GameType: z.ZodOptional<z.ZodObject<{
            Id: z.ZodOptional<z.ZodString>;
            Name: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            Id: z.ZodOptional<z.ZodString>;
            Name: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            Id: z.ZodOptional<z.ZodString>;
            Name: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>>>;
    Teams: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        Players: z.ZodOptional<z.ZodArray<z.ZodObject<{
            PlayerName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            DeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            PreconfiguredDeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            Statistics: z.ZodOptional<z.ZodObject<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            PlayerName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            DeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            PreconfiguredDeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            Statistics: z.ZodOptional<z.ZodObject<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            PlayerName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            DeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            PreconfiguredDeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            Statistics: z.ZodOptional<z.ZodObject<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        Players: z.ZodOptional<z.ZodArray<z.ZodObject<{
            PlayerName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            DeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            PreconfiguredDeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            Statistics: z.ZodOptional<z.ZodObject<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            PlayerName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            DeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            PreconfiguredDeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            Statistics: z.ZodOptional<z.ZodObject<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            PlayerName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            DeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            PreconfiguredDeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            Statistics: z.ZodOptional<z.ZodObject<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        Players: z.ZodOptional<z.ZodArray<z.ZodObject<{
            PlayerName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            DeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            PreconfiguredDeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            Statistics: z.ZodOptional<z.ZodObject<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            PlayerName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            DeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            PreconfiguredDeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            Statistics: z.ZodOptional<z.ZodObject<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            PlayerName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            DeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            PreconfiguredDeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            Statistics: z.ZodOptional<z.ZodObject<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
    }, z.ZodTypeAny, "passthrough">>>>;
    WinSide: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    Id: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    Name: z.ZodOptional<z.ZodString>;
    LaunchTime: z.ZodOptional<z.ZodString>;
    StartTime: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    FinishTime: z.ZodOptional<z.ZodString>;
    DurationSeconds: z.ZodOptional<z.ZodNumber>;
    Environment: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        GameType: z.ZodOptional<z.ZodObject<{
            Id: z.ZodOptional<z.ZodString>;
            Name: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            Id: z.ZodOptional<z.ZodString>;
            Name: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            Id: z.ZodOptional<z.ZodString>;
            Name: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        GameType: z.ZodOptional<z.ZodObject<{
            Id: z.ZodOptional<z.ZodString>;
            Name: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            Id: z.ZodOptional<z.ZodString>;
            Name: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            Id: z.ZodOptional<z.ZodString>;
            Name: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        GameType: z.ZodOptional<z.ZodObject<{
            Id: z.ZodOptional<z.ZodString>;
            Name: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            Id: z.ZodOptional<z.ZodString>;
            Name: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            Id: z.ZodOptional<z.ZodString>;
            Name: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>>>;
    Teams: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        Players: z.ZodOptional<z.ZodArray<z.ZodObject<{
            PlayerName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            DeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            PreconfiguredDeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            Statistics: z.ZodOptional<z.ZodObject<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            PlayerName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            DeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            PreconfiguredDeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            Statistics: z.ZodOptional<z.ZodObject<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            PlayerName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            DeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            PreconfiguredDeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            Statistics: z.ZodOptional<z.ZodObject<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        Players: z.ZodOptional<z.ZodArray<z.ZodObject<{
            PlayerName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            DeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            PreconfiguredDeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            Statistics: z.ZodOptional<z.ZodObject<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            PlayerName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            DeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            PreconfiguredDeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            Statistics: z.ZodOptional<z.ZodObject<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            PlayerName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            DeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            PreconfiguredDeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            Statistics: z.ZodOptional<z.ZodObject<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        Players: z.ZodOptional<z.ZodArray<z.ZodObject<{
            PlayerName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            DeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            PreconfiguredDeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            Statistics: z.ZodOptional<z.ZodObject<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            PlayerName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            DeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            PreconfiguredDeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            Statistics: z.ZodOptional<z.ZodObject<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            PlayerName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            DeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            PreconfiguredDeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            Statistics: z.ZodOptional<z.ZodObject<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
    }, z.ZodTypeAny, "passthrough">>>>;
    WinSide: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    Id: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    Name: z.ZodOptional<z.ZodString>;
    LaunchTime: z.ZodOptional<z.ZodString>;
    StartTime: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    FinishTime: z.ZodOptional<z.ZodString>;
    DurationSeconds: z.ZodOptional<z.ZodNumber>;
    Environment: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        GameType: z.ZodOptional<z.ZodObject<{
            Id: z.ZodOptional<z.ZodString>;
            Name: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            Id: z.ZodOptional<z.ZodString>;
            Name: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            Id: z.ZodOptional<z.ZodString>;
            Name: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        GameType: z.ZodOptional<z.ZodObject<{
            Id: z.ZodOptional<z.ZodString>;
            Name: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            Id: z.ZodOptional<z.ZodString>;
            Name: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            Id: z.ZodOptional<z.ZodString>;
            Name: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        GameType: z.ZodOptional<z.ZodObject<{
            Id: z.ZodOptional<z.ZodString>;
            Name: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            Id: z.ZodOptional<z.ZodString>;
            Name: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            Id: z.ZodOptional<z.ZodString>;
            Name: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>>>;
    Teams: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        Players: z.ZodOptional<z.ZodArray<z.ZodObject<{
            PlayerName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            DeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            PreconfiguredDeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            Statistics: z.ZodOptional<z.ZodObject<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            PlayerName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            DeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            PreconfiguredDeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            Statistics: z.ZodOptional<z.ZodObject<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            PlayerName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            DeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            PreconfiguredDeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            Statistics: z.ZodOptional<z.ZodObject<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        Players: z.ZodOptional<z.ZodArray<z.ZodObject<{
            PlayerName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            DeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            PreconfiguredDeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            Statistics: z.ZodOptional<z.ZodObject<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            PlayerName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            DeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            PreconfiguredDeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            Statistics: z.ZodOptional<z.ZodObject<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            PlayerName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            DeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            PreconfiguredDeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            Statistics: z.ZodOptional<z.ZodObject<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        Players: z.ZodOptional<z.ZodArray<z.ZodObject<{
            PlayerName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            DeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            PreconfiguredDeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            Statistics: z.ZodOptional<z.ZodObject<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            PlayerName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            DeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            PreconfiguredDeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            Statistics: z.ZodOptional<z.ZodObject<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            PlayerName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            DeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            PreconfiguredDeviceId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            Statistics: z.ZodOptional<z.ZodObject<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                Score: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Deaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Shots: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                MaxConsecutiveKills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                ConsecutiveDeaths: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                NemesisPlayerId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Kills: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                Hits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                TotalDamage: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                FatalHits: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
    }, z.ZodTypeAny, "passthrough">>>>;
    WinSide: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.ZodTypeAny, "passthrough">>;
export type MatchLine = z.infer<typeof matchLineSchema>;
export declare function parseMatchLine(line: string): MatchLine | null;

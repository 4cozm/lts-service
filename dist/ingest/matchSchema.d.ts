import { z } from "zod";
export declare const matchLineSchema: z.ZodObject<{
    Id: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    Name: z.ZodOptional<z.ZodString>;
    LaunchTime: z.ZodOptional<z.ZodString>;
    FinishTime: z.ZodOptional<z.ZodString>;
    DurationSeconds: z.ZodOptional<z.ZodNumber>;
    Teams: z.ZodOptional<z.ZodObject<{
        Red: z.ZodOptional<z.ZodObject<{
            teamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            score: z.ZodOptional<z.ZodNumber>;
            players: z.ZodOptional<z.ZodArray<z.ZodObject<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            teamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            score: z.ZodOptional<z.ZodNumber>;
            players: z.ZodOptional<z.ZodArray<z.ZodObject<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            teamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            score: z.ZodOptional<z.ZodNumber>;
            players: z.ZodOptional<z.ZodArray<z.ZodObject<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
        }, z.ZodTypeAny, "passthrough">>>;
        Blue: z.ZodOptional<z.ZodObject<{
            teamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            score: z.ZodOptional<z.ZodNumber>;
            players: z.ZodOptional<z.ZodArray<z.ZodObject<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            teamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            score: z.ZodOptional<z.ZodNumber>;
            players: z.ZodOptional<z.ZodArray<z.ZodObject<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            teamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            score: z.ZodOptional<z.ZodNumber>;
            players: z.ZodOptional<z.ZodArray<z.ZodObject<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "strip", z.ZodTypeAny, {
        Red?: z.objectOutputType<{
            teamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            score: z.ZodOptional<z.ZodNumber>;
            players: z.ZodOptional<z.ZodArray<z.ZodObject<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
        Blue?: z.objectOutputType<{
            teamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            score: z.ZodOptional<z.ZodNumber>;
            players: z.ZodOptional<z.ZodArray<z.ZodObject<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
    }, {
        Red?: z.objectInputType<{
            teamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            score: z.ZodOptional<z.ZodNumber>;
            players: z.ZodOptional<z.ZodArray<z.ZodObject<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
        Blue?: z.objectInputType<{
            teamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            score: z.ZodOptional<z.ZodNumber>;
            players: z.ZodOptional<z.ZodArray<z.ZodObject<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
    }>>;
    Result: z.ZodOptional<z.ZodObject<{
        winTeamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        winSide: z.ZodOptional<z.ZodString>;
        resultType: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        winTeamId?: string | number | undefined;
        winSide?: string | undefined;
        resultType?: string | undefined;
    }, {
        winTeamId?: string | number | undefined;
        winSide?: string | undefined;
        resultType?: string | undefined;
    }>>;
    FirstBlood: z.ZodOptional<z.ZodObject<{
        killer: z.ZodOptional<z.ZodUnknown>;
        victim: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        killer?: unknown;
        victim?: unknown;
    }, {
        killer?: unknown;
        victim?: unknown;
    }>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    Id: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    Name: z.ZodOptional<z.ZodString>;
    LaunchTime: z.ZodOptional<z.ZodString>;
    FinishTime: z.ZodOptional<z.ZodString>;
    DurationSeconds: z.ZodOptional<z.ZodNumber>;
    Teams: z.ZodOptional<z.ZodObject<{
        Red: z.ZodOptional<z.ZodObject<{
            teamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            score: z.ZodOptional<z.ZodNumber>;
            players: z.ZodOptional<z.ZodArray<z.ZodObject<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            teamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            score: z.ZodOptional<z.ZodNumber>;
            players: z.ZodOptional<z.ZodArray<z.ZodObject<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            teamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            score: z.ZodOptional<z.ZodNumber>;
            players: z.ZodOptional<z.ZodArray<z.ZodObject<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
        }, z.ZodTypeAny, "passthrough">>>;
        Blue: z.ZodOptional<z.ZodObject<{
            teamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            score: z.ZodOptional<z.ZodNumber>;
            players: z.ZodOptional<z.ZodArray<z.ZodObject<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            teamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            score: z.ZodOptional<z.ZodNumber>;
            players: z.ZodOptional<z.ZodArray<z.ZodObject<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            teamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            score: z.ZodOptional<z.ZodNumber>;
            players: z.ZodOptional<z.ZodArray<z.ZodObject<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "strip", z.ZodTypeAny, {
        Red?: z.objectOutputType<{
            teamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            score: z.ZodOptional<z.ZodNumber>;
            players: z.ZodOptional<z.ZodArray<z.ZodObject<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
        Blue?: z.objectOutputType<{
            teamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            score: z.ZodOptional<z.ZodNumber>;
            players: z.ZodOptional<z.ZodArray<z.ZodObject<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
    }, {
        Red?: z.objectInputType<{
            teamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            score: z.ZodOptional<z.ZodNumber>;
            players: z.ZodOptional<z.ZodArray<z.ZodObject<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
        Blue?: z.objectInputType<{
            teamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            score: z.ZodOptional<z.ZodNumber>;
            players: z.ZodOptional<z.ZodArray<z.ZodObject<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
    }>>;
    Result: z.ZodOptional<z.ZodObject<{
        winTeamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        winSide: z.ZodOptional<z.ZodString>;
        resultType: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        winTeamId?: string | number | undefined;
        winSide?: string | undefined;
        resultType?: string | undefined;
    }, {
        winTeamId?: string | number | undefined;
        winSide?: string | undefined;
        resultType?: string | undefined;
    }>>;
    FirstBlood: z.ZodOptional<z.ZodObject<{
        killer: z.ZodOptional<z.ZodUnknown>;
        victim: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        killer?: unknown;
        victim?: unknown;
    }, {
        killer?: unknown;
        victim?: unknown;
    }>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    Id: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    Name: z.ZodOptional<z.ZodString>;
    LaunchTime: z.ZodOptional<z.ZodString>;
    FinishTime: z.ZodOptional<z.ZodString>;
    DurationSeconds: z.ZodOptional<z.ZodNumber>;
    Teams: z.ZodOptional<z.ZodObject<{
        Red: z.ZodOptional<z.ZodObject<{
            teamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            score: z.ZodOptional<z.ZodNumber>;
            players: z.ZodOptional<z.ZodArray<z.ZodObject<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            teamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            score: z.ZodOptional<z.ZodNumber>;
            players: z.ZodOptional<z.ZodArray<z.ZodObject<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            teamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            score: z.ZodOptional<z.ZodNumber>;
            players: z.ZodOptional<z.ZodArray<z.ZodObject<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
        }, z.ZodTypeAny, "passthrough">>>;
        Blue: z.ZodOptional<z.ZodObject<{
            teamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            score: z.ZodOptional<z.ZodNumber>;
            players: z.ZodOptional<z.ZodArray<z.ZodObject<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            teamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            score: z.ZodOptional<z.ZodNumber>;
            players: z.ZodOptional<z.ZodArray<z.ZodObject<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            teamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            score: z.ZodOptional<z.ZodNumber>;
            players: z.ZodOptional<z.ZodArray<z.ZodObject<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "strip", z.ZodTypeAny, {
        Red?: z.objectOutputType<{
            teamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            score: z.ZodOptional<z.ZodNumber>;
            players: z.ZodOptional<z.ZodArray<z.ZodObject<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
        Blue?: z.objectOutputType<{
            teamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            score: z.ZodOptional<z.ZodNumber>;
            players: z.ZodOptional<z.ZodArray<z.ZodObject<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
    }, {
        Red?: z.objectInputType<{
            teamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            score: z.ZodOptional<z.ZodNumber>;
            players: z.ZodOptional<z.ZodArray<z.ZodObject<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
        Blue?: z.objectInputType<{
            teamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            score: z.ZodOptional<z.ZodNumber>;
            players: z.ZodOptional<z.ZodArray<z.ZodObject<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                playerId: z.ZodOptional<z.ZodNumber>;
                kills: z.ZodOptional<z.ZodNumber>;
                deaths: z.ZodOptional<z.ZodNumber>;
                shots: z.ZodOptional<z.ZodNumber>;
                hits: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodOptional<z.ZodNumber>;
                damageDealt: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
    }>>;
    Result: z.ZodOptional<z.ZodObject<{
        winTeamId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        winSide: z.ZodOptional<z.ZodString>;
        resultType: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        winTeamId?: string | number | undefined;
        winSide?: string | undefined;
        resultType?: string | undefined;
    }, {
        winTeamId?: string | number | undefined;
        winSide?: string | undefined;
        resultType?: string | undefined;
    }>>;
    FirstBlood: z.ZodOptional<z.ZodObject<{
        killer: z.ZodOptional<z.ZodUnknown>;
        victim: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        killer?: unknown;
        victim?: unknown;
    }, {
        killer?: unknown;
        victim?: unknown;
    }>>;
}, z.ZodTypeAny, "passthrough">>;
export type MatchLine = z.infer<typeof matchLineSchema>;
export declare function parseMatchLine(line: string): MatchLine | null;

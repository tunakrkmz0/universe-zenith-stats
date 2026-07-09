import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import type { LolPlayerDetailResponse } from "@/types/lol-analysis";

type PlayerMatchStatWithMatch = {
  id: number;
  championName: string;
  role: string | null;
  win: boolean;

  kills: number;
  deaths: number;
  assists: number;

  totalCs: number;
  csPerMinute: unknown;
  visionScore: number;
  damageDealt: number;
  goldEarned: number;
  kda: unknown;

  createdAt: Date;

  match: {
    riotMatchId: string;
    gameCreation: Date;
    gameDurationSeconds: number;
    queueId: number;
  };
};

function roundToTwo(value: number): number {
  return Math.round(value * 100) / 100;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const playerId = Number(id);

    if (!Number.isInteger(playerId) || playerId <= 0) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Geçersiz oyuncu ID değeri.",
          },
        },
        { status: 400 }
      );
    }

    const player = await prisma.player.findUnique({
      where: {
        id: playerId,
      },
      include: {
        matchStats: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            match: true,
          },
        },
      },
    });

    if (!player) {
      return NextResponse.json(
        {
          error: {
            code: "PLAYER_NOT_FOUND",
            message: "Oyuncu bulunamadı.",
          },
        },
        { status: 404 }
      );
    }

    const matchStats = player.matchStats as PlayerMatchStatWithMatch[];
    const matchCount = matchStats.length;

    const winCount = matchStats.filter(
      (stat: PlayerMatchStatWithMatch) => stat.win
    ).length;

    const averageKda =
      matchCount === 0
        ? 0
        : roundToTwo(
            matchStats.reduce(
              (sum: number, stat: PlayerMatchStatWithMatch) =>
                sum + Number(stat.kda),
              0
            ) / matchCount
          );

    const averageCsPerMinute =
      matchCount === 0
        ? 0
        : roundToTwo(
            matchStats.reduce(
              (sum: number, stat: PlayerMatchStatWithMatch) =>
                sum + Number(stat.csPerMinute),
              0
            ) / matchCount
          );

    const averageVisionScore =
      matchCount === 0
        ? 0
        : roundToTwo(
            matchStats.reduce(
              (sum: number, stat: PlayerMatchStatWithMatch) =>
                sum + stat.visionScore,
              0
            ) / matchCount
          );

    const averageDamageDealt =
      matchCount === 0
        ? 0
        : roundToTwo(
            matchStats.reduce(
              (sum: number, stat: PlayerMatchStatWithMatch) =>
                sum + stat.damageDealt,
              0
            ) / matchCount
          );

    const averageGoldEarned =
      matchCount === 0
        ? 0
        : roundToTwo(
            matchStats.reduce(
              (sum: number, stat: PlayerMatchStatWithMatch) =>
                sum + stat.goldEarned,
              0
            ) / matchCount
          );

    const response: LolPlayerDetailResponse = {
      player: {
        id: player.id,
        gameName: player.riotGameName,
        tagLine: player.riotTagLine,
        region: player.region,
        puuid: player.puuid,
        lastFetchedAt: player.lastFetchedAt,
        createdAt: player.createdAt,
        updatedAt: player.updatedAt,
      },
      summary: {
        matchCount,
        winRate:
          matchCount === 0 ? 0 : roundToTwo((winCount / matchCount) * 100),
        averageKda,
        averageCsPerMinute,
        averageVisionScore,
        averageDamageDealt,
        averageGoldEarned,
      },
      matches: matchStats.map((stat: PlayerMatchStatWithMatch) => ({
        id: stat.id,
        matchId: stat.match.riotMatchId,
        championName: stat.championName,
        role: stat.role,
        win: stat.win,

        kills: stat.kills,
        deaths: stat.deaths,
        assists: stat.assists,

        kda: Number(stat.kda),
        totalCs: stat.totalCs,
        csPerMinute: Number(stat.csPerMinute),

        visionScore: stat.visionScore,
        damageDealt: stat.damageDealt,
        goldEarned: stat.goldEarned,

        gameCreation: stat.match.gameCreation,
        gameDurationSeconds: stat.match.gameDurationSeconds,
        queueId: stat.match.queueId,
        createdAt: stat.createdAt,
      })),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("LOL_PLAYER_DETAIL_ERROR:", error);

    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Oyuncu detayları alınırken hata oluştu.",
        },
      },
      { status: 500 }
    );
  }
}

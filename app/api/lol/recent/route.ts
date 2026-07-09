import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import type { LolRecentPlayersResponse } from "@/types/lol-analysis";

type RecentPlayerRecord = {
  id: number;
  riotGameName: string;
  riotTagLine: string;
  region: string;
  puuid: string;
  lastFetchedAt: Date | null;
  updatedAt: Date;
  _count: {
    matchStats: number;
  };
};

export async function GET() {
  try {
    const players = (await prisma.player.findMany({
      orderBy: {
        lastFetchedAt: "desc",
      },
      take: 10,
      select: {
        id: true,
        riotGameName: true,
        riotTagLine: true,
        region: true,
        puuid: true,
        lastFetchedAt: true,
        updatedAt: true,
        _count: {
          select: {
            matchStats: true,
          },
        },
      },
    })) as RecentPlayerRecord[];

    const response: LolRecentPlayersResponse = {
      players: players.map((player: RecentPlayerRecord) => ({
        id: player.id,
        gameName: player.riotGameName,
        tagLine: player.riotTagLine,
        region: player.region,
        puuid: player.puuid,
        analyzedMatchCount: player._count.matchStats,
        lastFetchedAt: player.lastFetchedAt,
        updatedAt: player.updatedAt,
      })),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("LOL_RECENT_PLAYERS_ERROR:", error);

    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Son analizlenen oyuncular alınırken hata oluştu.",
        },
      },
      { status: 500 }
    );
  }
}

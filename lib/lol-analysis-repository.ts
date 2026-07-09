import type { LolAnalysisResponse } from "@/types/lol-analysis";

import { prisma } from "@/lib/prisma";

function createFallbackPuuid(analysis: LolAnalysisResponse): string {
  const gameName = analysis.player.gameName.trim().toLowerCase();
  const tagLine = analysis.player.tagLine.trim().toLowerCase();
  const region = analysis.player.region;

  return `mock:${region}:${gameName}:${tagLine}`;
}

function createJsonPayload(value: unknown) {
  return JSON.parse(JSON.stringify(value));
}

export async function saveLolAnalysisResult(analysis: LolAnalysisResponse) {
  const playerPuuid = analysis.player.puuid ?? createFallbackPuuid(analysis);

  const player = await prisma.player.upsert({
    where: {
      puuid: playerPuuid,
    },
    update: {
      riotGameName: analysis.player.gameName,
      riotTagLine: analysis.player.tagLine,
      region: analysis.player.region,
      lastFetchedAt: new Date(),
    },
    create: {
      riotGameName: analysis.player.gameName,
      riotTagLine: analysis.player.tagLine,
      puuid: playerPuuid,
      region: analysis.player.region,
      lastFetchedAt: new Date(),
    },
  });

  for (const analyzedMatch of analysis.matches) {
    const rawJson = createJsonPayload(analyzedMatch);

    const match = await prisma.match.upsert({
      where: {
        riotMatchId: analyzedMatch.matchId,
      },
      update: {
        gameCreation: new Date(analyzedMatch.gameCreation),
        gameDurationSeconds: analyzedMatch.gameDurationSeconds,
        queueId: analyzedMatch.queueId,
        rawJson,
      },
      create: {
        riotMatchId: analyzedMatch.matchId,
        gameCreation: new Date(analyzedMatch.gameCreation),
        gameDurationSeconds: analyzedMatch.gameDurationSeconds,
        queueId: analyzedMatch.queueId,
        rawJson,
      },
    });

    await prisma.playerMatchStat.upsert({
      where: {
        playerId_matchId: {
          playerId: player.id,
          matchId: match.id,
        },
      },
      update: {
        championName: analyzedMatch.championName,
        role: analyzedMatch.role,
        win: analyzedMatch.win,

        kills: analyzedMatch.kills,
        deaths: analyzedMatch.deaths,
        assists: analyzedMatch.assists,

        totalCs: analyzedMatch.totalCs,
        csPerMinute: analyzedMatch.csPerMinute,

        visionScore: analyzedMatch.visionScore,
        damageDealt: analyzedMatch.damageDealt,
        goldEarned: analyzedMatch.goldEarned,

        killParticipation: null,
        kda: analyzedMatch.kda,
      },
      create: {
        playerId: player.id,
        matchId: match.id,

        championName: analyzedMatch.championName,
        role: analyzedMatch.role,
        win: analyzedMatch.win,

        kills: analyzedMatch.kills,
        deaths: analyzedMatch.deaths,
        assists: analyzedMatch.assists,

        totalCs: analyzedMatch.totalCs,
        csPerMinute: analyzedMatch.csPerMinute,

        visionScore: analyzedMatch.visionScore,
        damageDealt: analyzedMatch.damageDealt,
        goldEarned: analyzedMatch.goldEarned,

        killParticipation: null,
        kda: analyzedMatch.kda,
      },
    });
  }

  return {
    playerId: player.id,
    savedMatchCount: analysis.matches.length,
  };
}

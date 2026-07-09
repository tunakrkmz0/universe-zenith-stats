import type {
  LolAnalysisMatch,
  LolAnalysisRecommendation,
  LolAnalysisSummary,
} from "@/types/lol-analysis";

export type RiotParticipantLike = {
  puuid: string;
  championName: string;
  teamPosition?: string;
  individualPosition?: string;
  win: boolean;

  kills: number;
  deaths: number;
  assists: number;

  totalMinionsKilled: number;
  neutralMinionsKilled: number;

  visionScore: number;
  totalDamageDealtToChampions: number;
  goldEarned: number;
};

export type RiotTeamLike = {
  teamId: number;
  objectives?: {
    champion?: {
      kills?: number;
    };
  };
};

export type RiotMatchLike = {
  metadata: {
    matchId: string;
  };
  info: {
    gameCreation?: number;
    gameDuration: number;
    queueId: number;
    participants: RiotParticipantLike[];
    teams?: RiotTeamLike[];
  };
};

function roundToTwo(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateKda(
  kills: number,
  deaths: number,
  assists: number
): number {
  if (deaths === 0) {
    return roundToTwo(kills + assists);
  }

  return roundToTwo((kills + assists) / deaths);
}

export function calculateCsPerMinute(
  totalCs: number,
  gameDurationSeconds: number
): number {
  const gameDurationMinutes = gameDurationSeconds / 60;

  if (gameDurationMinutes <= 0) {
    return 0;
  }

  return roundToTwo(totalCs / gameDurationMinutes);
}

export function mapRiotMatchToAnalysisMatch(params: {
  match: RiotMatchLike;
  playerPuuid: string;
}): LolAnalysisMatch | null {
  const participant = params.match.info.participants.find(
    (item) => item.puuid === params.playerPuuid
  );

  if (!participant) {
    return null;
  }

  const totalCs =
    participant.totalMinionsKilled + participant.neutralMinionsKilled;

  return {
    matchId: params.match.metadata.matchId,
    championName: participant.championName,
    role: participant.teamPosition || participant.individualPosition || null,
    win: participant.win,

    kills: participant.kills,
    deaths: participant.deaths,
    assists: participant.assists,

    kda: calculateKda(
      participant.kills,
      participant.deaths,
      participant.assists
    ),
    totalCs,
    csPerMinute: calculateCsPerMinute(
      totalCs,
      params.match.info.gameDuration
    ),

    visionScore: participant.visionScore,
    damageDealt: participant.totalDamageDealtToChampions,
    goldEarned: participant.goldEarned,

    gameCreation: new Date(
      params.match.info.gameCreation ?? Date.now()
    ).toISOString(),
    gameDurationSeconds: params.match.info.gameDuration,
    queueId: params.match.info.queueId,
  };
}

export function calculateAnalysisSummary(
  matches: LolAnalysisMatch[]
): LolAnalysisSummary {
  if (matches.length === 0) {
    return {
      matchCount: 0,
      winRate: 0,
      averageKda: 0,
      averageCsPerMinute: 0,
      averageVisionScore: 0,
      averageDamageDealt: 0,
      averageGoldEarned: 0,
    };
  }

  const totalWins = matches.filter((match) => match.win).length;

  const totalKda = matches.reduce((sum, match) => sum + match.kda, 0);
  const totalCsPerMinute = matches.reduce(
    (sum, match) => sum + match.csPerMinute,
    0
  );
  const totalVisionScore = matches.reduce(
    (sum, match) => sum + match.visionScore,
    0
  );
  const totalDamageDealt = matches.reduce(
    (sum, match) => sum + match.damageDealt,
    0
  );
  const totalGoldEarned = matches.reduce(
    (sum, match) => sum + match.goldEarned,
    0
  );

  return {
    matchCount: matches.length,
    winRate: roundToTwo((totalWins / matches.length) * 100),
    averageKda: roundToTwo(totalKda / matches.length),
    averageCsPerMinute: roundToTwo(totalCsPerMinute / matches.length),
    averageVisionScore: roundToTwo(totalVisionScore / matches.length),
    averageDamageDealt: roundToTwo(totalDamageDealt / matches.length),
    averageGoldEarned: roundToTwo(totalGoldEarned / matches.length),
  };
}

export function generateRecommendations(
  summary: LolAnalysisSummary
): LolAnalysisRecommendation[] {
  const recommendations: LolAnalysisRecommendation[] = [];

  if (summary.winRate >= 55) {
    recommendations.push({
      type: "success",
      title: "Kazanma oranın iyi",
      description:
        "Son maçlarda kazanma oranın olumlu görünüyor. Mevcut oyun tarzını koruyup zayıf metrikleri geliştirmeye odaklanabilirsin.",
    });
  }

  if (summary.averageKda < 2) {
    recommendations.push({
      type: "warning",
      title: "KDA değerin geliştirilebilir",
      description:
        "KDA ortalaman düşük görünüyor. Daha az ölmek, görüşsüz bölgelere tek girmemek ve takım savaşlarına daha kontrollü katılmak faydalı olur.",
    });
  }

  if (summary.averageCsPerMinute < 6) {
    recommendations.push({
      type: "warning",
      title: "CS/dk değerin düşük",
      description:
        "Dakika başına minyon skorun geliştirilebilir. Laning sonrası yan koridor farm takibini artırman faydalı olur.",
    });
  }

  if (summary.averageVisionScore < 18) {
    recommendations.push({
      type: "info",
      title: "Vision katkını takip et",
      description:
        "Vision score değerin düşük olabilir. Base dönüşlerinde control ward almak ve objektif öncesi görüş hazırlamak daha güvenli oyun sağlar.",
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      type: "success",
      title: "Genel performans dengeli",
      description:
        "Son maç metriklerin dengeli görünüyor. Daha detaylı gelişim için rol bazlı analiz yapılabilir.",
    });
  }

  return recommendations;
}
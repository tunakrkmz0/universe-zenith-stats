export type LolRegion = "tr1" | "euw1" | "eun1" | "na1" | "kr";

export type LolAnalysisRequest = {
  gameName: string;
  tagLine: string;
  region: LolRegion;
};

export type LolAnalysisPlayer = {
  gameName: string;
  tagLine: string;
  region: LolRegion;
  puuid?: string;
};

export type LolAnalysisSummary = {
  matchCount: number;
  winRate: number;
  averageKda: number;
  averageCsPerMinute: number;
  averageVisionScore: number;
  averageDamageDealt: number;
  averageGoldEarned: number;
};

export type LolAnalysisMatch = {
  matchId: string;
  championName: string;
  role: string | null;
  win: boolean;

  kills: number;
  deaths: number;
  assists: number;

  kda: number;
  totalCs: number;
  csPerMinute: number;

  visionScore: number;
  damageDealt: number;
  goldEarned: number;

  gameCreation: string;
  gameDurationSeconds: number;
  queueId: number;
};

export type LolAnalysisRecommendation = {
  type: "success" | "warning" | "danger" | "info";
  title: string;
  description: string;
};

export type LolAnalysisResponse = {
  player: LolAnalysisPlayer;
  summary: LolAnalysisSummary;
  matches: LolAnalysisMatch[];
  recommendations: LolAnalysisRecommendation[];
};

export type LolAnalysisErrorResponse = {
  error: {
    code:
      | "VALIDATION_ERROR"
      | "PLAYER_NOT_FOUND"
      | "RIOT_API_ERROR"
      | "RATE_LIMITED"
      | "INTERNAL_ERROR";
    message: string;
  };
};
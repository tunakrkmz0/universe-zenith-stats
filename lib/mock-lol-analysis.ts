import type { LolAnalysisResponse } from "@/types/lol-analysis";
import {
  calculateAnalysisSummary,
  generateRecommendations,
  mapRiotMatchToAnalysisMatch,
  type RiotMatchLike,
} from "@/lib/lol-analysis";

const mockPlayerPuuid = "mock-puuid-demo-player";

const mockRiotMatches: RiotMatchLike[] = [
  {
    metadata: {
      matchId: "TR1_100000001",
    },
    info: {
      gameDuration: 1800,
      queueId: 420,
      participants: [
        {
          puuid: mockPlayerPuuid,
          championName: "Ahri",
          teamPosition: "MID",
          individualPosition: "MIDDLE",
          win: true,
          kills: 8,
          deaths: 3,
          assists: 11,
          totalMinionsKilled: 201,
          neutralMinionsKilled: 13,
          visionScore: 19,
          totalDamageDealtToChampions: 26400,
          goldEarned: 12600,
        },
      ],
    },
  },
  {
    metadata: {
      matchId: "TR1_100000002",
    },
    info: {
      gameDuration: 1840,
      queueId: 420,
      participants: [
        {
          puuid: mockPlayerPuuid,
          championName: "Jinx",
          teamPosition: "BOTTOM",
          individualPosition: "BOTTOM",
          win: false,
          kills: 5,
          deaths: 7,
          assists: 8,
          totalMinionsKilled: 188,
          neutralMinionsKilled: 8,
          visionScore: 13,
          totalDamageDealtToChampions: 21800,
          goldEarned: 10900,
        },
      ],
    },
  },
  {
    metadata: {
      matchId: "TR1_100000003",
    },
    info: {
      gameDuration: 1805,
      queueId: 420,
      participants: [
        {
          puuid: mockPlayerPuuid,
          championName: "Lee Sin",
          teamPosition: "JUNGLE",
          individualPosition: "JUNGLE",
          win: true,
          kills: 7,
          deaths: 4,
          assists: 14,
          totalMinionsKilled: 34,
          neutralMinionsKilled: 122,
          visionScore: 31,
          totalDamageDealtToChampions: 18700,
          goldEarned: 11650,
        },
      ],
    },
  },
];

const matches = mockRiotMatches
  .map((match) =>
    mapRiotMatchToAnalysisMatch({
      match,
      playerPuuid: mockPlayerPuuid,
    })
  )
  .filter((match) => match !== null);

const summary = calculateAnalysisSummary(matches);
const recommendations = generateRecommendations(summary);

export const mockLolAnalysisResponse: LolAnalysisResponse = {
  player: {
    gameName: "DemoPlayer",
    tagLine: "TR1",
    region: "tr1",
    puuid: mockPlayerPuuid,
  },
  summary,
  matches,
  recommendations,
};
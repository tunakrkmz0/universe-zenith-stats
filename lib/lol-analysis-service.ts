import type {
  LolAnalysisRequest,
  LolAnalysisResponse,
  LolAnalysisMatch,
} from "@/types/lol-analysis";

import {
  calculateAnalysisSummary,
  generateRecommendations,
  mapRiotMatchToAnalysisMatch,
  type RiotMatchLike,
} from "@/lib/lol-analysis";

import {
  getMatchDetailByMatchId,
  getMatchIdsByPuuid,
  getRiotAccountByRiotId,
} from "@/lib/riot";

function isAnalysisMatch(
  match: LolAnalysisMatch | null
): match is LolAnalysisMatch {
  return match !== null;
}

export async function analyzeLolPlayer(
  request: LolAnalysisRequest
): Promise<LolAnalysisResponse> {
  const account = await getRiotAccountByRiotId({
    gameName: request.gameName,
    tagLine: request.tagLine,
    region: request.region,
  });

  const matchIds = await getMatchIdsByPuuid({
    puuid: account.puuid,
    region: request.region,
    count: 10,
  });

  const matchDetails = await Promise.all(
    matchIds.map((matchId) =>
      getMatchDetailByMatchId({
        matchId,
        region: request.region,
      })
    )
  );

  const matches = matchDetails
    .map((matchDetail) =>
      mapRiotMatchToAnalysisMatch({
        match: matchDetail as RiotMatchLike,
        playerPuuid: account.puuid,
      })
    )
    .filter(isAnalysisMatch);

  const summary = calculateAnalysisSummary(matches);
  const recommendations = generateRecommendations(summary);

  return {
    player: {
      gameName: account.gameName,
      tagLine: account.tagLine,
      region: request.region,
      puuid: account.puuid,
    },
    summary,
    matches,
    recommendations,
  };
}
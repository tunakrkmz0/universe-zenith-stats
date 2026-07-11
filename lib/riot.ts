import type { LolRegion } from "@/types/lol-analysis";

const RIOT_API_KEY = process.env.RIOT_API_KEY;

export type RiotAccountDto = {
  puuid: string;
  gameName: string;
  tagLine: string;
};

export type RiotSummonerDto = {
  id: string;
  accountId: string;
  puuid: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
};

export type RiotMatchId = string;

export type RiotServiceErrorCode =
  | "MISSING_API_KEY"
  | "PLAYER_NOT_FOUND"
  | "RIOT_API_ERROR"
  | "RATE_LIMITED";

export class RiotServiceError extends Error {
  code: RiotServiceErrorCode;
  statusCode: number;

  constructor(code: RiotServiceErrorCode, message: string, statusCode = 500) {
    super(message);
    this.name = "RiotServiceError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

function getRegionalRoutingValue(region: LolRegion): string {
  if (region === "tr1" || region === "euw1" || region === "eun1") {
    return "europe";
  }

  if (region === "na1") {
    return "americas";
  }

  if (region === "kr") {
    return "asia";
  }

  return "europe";
}

function assertRiotApiKey() {
  if (!RIOT_API_KEY) {
    throw new RiotServiceError(
      "MISSING_API_KEY",
      "Riot API key tanımlı değil.",
      500
    );
  }
}

async function riotFetch<T>(url: string): Promise<T> {
  assertRiotApiKey();

  const response = await fetch(url, {
    headers: {
      "X-Riot-Token": RIOT_API_KEY as string,
    },
    next: {
      revalidate: 60,
    },
  });

  if (response.status === 404) {
    throw new RiotServiceError(
      "PLAYER_NOT_FOUND",
      "Oyuncu bulunamadı.",
      404
    );
  }

  if (response.status === 429) {
    throw new RiotServiceError(
      "RATE_LIMITED",
      "Riot API rate limit sınırı aşıldı.",
      429
    );
  }

  if (!response.ok) {
    throw new RiotServiceError(
      "RIOT_API_ERROR",
      "Riot API isteği başarısız oldu.",
      response.status
    );
  }

  return response.json() as Promise<T>;
}

export async function getRiotAccountByRiotId(params: {
  gameName: string;
  tagLine: string;
  region: LolRegion;
}): Promise<RiotAccountDto> {
  const regionalRoutingValue = getRegionalRoutingValue(params.region);

  const gameName = encodeURIComponent(params.gameName);
  const tagLine = encodeURIComponent(params.tagLine);

  const url = `https://${regionalRoutingValue}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`;

  return riotFetch<RiotAccountDto>(url);
}

export async function getMatchIdsByPuuid(params: {
  puuid: string;
  region: LolRegion;
  count?: number;
}): Promise<RiotMatchId[]> {
  const regionalRoutingValue = getRegionalRoutingValue(params.region);
  const count = params.count ?? 10;

  const url = `https://${regionalRoutingValue}.api.riotgames.com/lol/match/v5/matches/by-puuid/${params.puuid}/ids?start=0&count=${count}`;

  return riotFetch<RiotMatchId[]>(url);
}

export async function getMatchDetailByMatchId(params: {
  matchId: string;
  region: LolRegion;
}): Promise<unknown> {
  const regionalRoutingValue = getRegionalRoutingValue(params.region);

  const matchId = encodeURIComponent(params.matchId);

  const url = `https://${regionalRoutingValue}.api.riotgames.com/lol/match/v5/matches/${matchId}`;

  return riotFetch<unknown>(url);
}

export async function getSummonerByPuuid(params: {
  puuid: string;
  region: LolRegion;
}): Promise<RiotSummonerDto> {
  const puuid = encodeURIComponent(params.puuid);
  const url = `https://${params.region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;

  return riotFetch<RiotSummonerDto>(url);
}

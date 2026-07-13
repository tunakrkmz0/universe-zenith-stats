import type {
  LolAnalysisResponse,
  LolRecentPlayer,
} from "@/types/lol-analysis";

const LOCAL_RECENT_PLAYERS_STORAGE_KEY = "uz_local_recent_lol_players";
const MAX_LOCAL_RECENT_PLAYERS = 10;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isValidRecentPlayer(value: unknown): value is LolRecentPlayer {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "number" &&
    typeof value.gameName === "string" &&
    typeof value.tagLine === "string" &&
    typeof value.region === "string" &&
    typeof value.puuid === "string" &&
    typeof value.analyzedMatchCount === "number"
  );
}

function createFallbackPuuid(analysis: LolAnalysisResponse): string {
  const gameName = analysis.player.gameName.trim().toLowerCase();
  const tagLine = analysis.player.tagLine.trim().toLowerCase();
  const region = analysis.player.region;

  return `local:${region}:${gameName}:${tagLine}`;
}

function isSamePlayer(a: LolRecentPlayer, b: LolRecentPlayer): boolean {
  return (
    a.id === b.id ||
    (a.gameName.trim().toLowerCase() === b.gameName.trim().toLowerCase() &&
      a.tagLine.trim().toLowerCase() === b.tagLine.trim().toLowerCase() &&
      a.region.trim().toLowerCase() === b.region.trim().toLowerCase())
  );
}

export function getLocalRecentLolPlayers(): LolRecentPlayer[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(
      LOCAL_RECENT_PLAYERS_STORAGE_KEY
    );

    if (!rawValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(rawValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue
      .filter(isValidRecentPlayer)
      .slice(0, MAX_LOCAL_RECENT_PLAYERS);
  } catch {
    return [];
  }
}

export function saveAnalysisToLocalRecentPlayers(
  analysis: LolAnalysisResponse
): LolRecentPlayer[] {
  if (typeof window === "undefined") {
    return [];
  }

  if (typeof analysis.player.id !== "number") {
    return getLocalRecentLolPlayers();
  }

  const now = new Date().toISOString();

  const recentPlayer: LolRecentPlayer = {
    id: analysis.player.id,
    gameName: analysis.player.gameName,
    tagLine: analysis.player.tagLine,
    region: analysis.player.region,
    puuid: analysis.player.puuid ?? createFallbackPuuid(analysis),
    profileIconId: analysis.player.profileIconId ?? null,
    analyzedMatchCount: analysis.summary.matchCount,
    lastFetchedAt: now,
    updatedAt: now,
  };

  const currentPlayers = getLocalRecentLolPlayers();

  const nextPlayers = [
    recentPlayer,
    ...currentPlayers.filter((player) => !isSamePlayer(player, recentPlayer)),
  ].slice(0, MAX_LOCAL_RECENT_PLAYERS);

  try {
    window.localStorage.setItem(
      LOCAL_RECENT_PLAYERS_STORAGE_KEY,
      JSON.stringify(nextPlayers)
    );
  } catch {
    return currentPlayers;
  }

  return nextPlayers;
}

export function clearLocalRecentLolPlayers() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(LOCAL_RECENT_PLAYERS_STORAGE_KEY);
}
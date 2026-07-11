type ChampionMatch = {
  championName: string;
};

export function getMostPlayedChampion(
  matches: ChampionMatch[]
): string | null {
  if (matches.length === 0) {
    return null;
  }

  const championCounts = new Map<string, number>();
  let mostPlayedChampion = matches[0].championName;
  let highestCount = 0;

  for (const match of matches) {
    const nextCount = (championCounts.get(match.championName) ?? 0) + 1;
    championCounts.set(match.championName, nextCount);

    if (nextCount > highestCount) {
      mostPlayedChampion = match.championName;
      highestCount = nextCount;
    }
  }

  return mostPlayedChampion;
}

export function getChampionSplashUrl(championName: string): string {
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${encodeURIComponent(championName)}_0.jpg`;
}

"use client";

import Image from "next/image";

const dataDragonVersion =
  process.env.NEXT_PUBLIC_DDRAGON_VERSION ?? "16.13.1";

type ChampionIconProps = {
  championName: string;
};

export function ChampionIcon({ championName }: ChampionIconProps) {
  const initial = championName.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="relative grid size-full place-items-center overflow-hidden bg-gradient-to-br from-[#15334a] to-[#06101e]">
      <span className="text-2xl font-black text-[#9af3ff]">{initial}</span>
      <Image
        src={`https://ddragon.leagueoflegends.com/cdn/${dataDragonVersion}/img/champion/${championName}.png`}
        alt={`${championName} şampiyon portresi`}
        fill
        sizes="64px"
        className="object-cover transition duration-500 group-hover/match:scale-110"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
}

"use client";

import Image from "next/image";

const dataDragonVersion =
  process.env.NEXT_PUBLIC_DDRAGON_VERSION ?? "16.13.1";

type ProfileIconProps = {
  profileIconId?: number | null;
  gameName: string;
  sizes: string;
  className?: string;
};

export function ProfileIcon({
  profileIconId,
  gameName,
  sizes,
  className = "",
}: ProfileIconProps) {
  const initial = gameName.trim().charAt(0).toUpperCase() || "?";

  return (
    <div
      className={`relative grid size-full place-items-center overflow-hidden bg-gradient-to-br from-[#16435a] via-[#0b2638] to-[#06101e] ${className}`}
    >
      <span className="text-3xl font-black text-[#9af3ff] drop-shadow-[0_0_8px_rgba(73,201,232,0.6)]">
        {initial}
      </span>

      {profileIconId != null && profileIconId >= 0 && (
        <Image
          src={`https://ddragon.leagueoflegends.com/cdn/${dataDragonVersion}/img/profileicon/${profileIconId}.png`}
          alt={`${gameName} profil ikonu`}
          fill
          sizes={sizes}
          className="object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      )}
    </div>
  );
}

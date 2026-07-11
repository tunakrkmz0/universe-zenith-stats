import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ddragon.leagueoflegends.com",
        port: "",
        pathname: "/cdn/*/img/profileicon/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "ddragon.leagueoflegends.com",
        port: "",
        pathname: "/cdn/*/img/champion/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;

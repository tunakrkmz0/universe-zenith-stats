import { NextResponse } from "next/server";

import type { LolRecentPlayersResponse } from "@/types/lol-analysis";

export async function GET() {
  const response: LolRecentPlayersResponse = {
    players: [],
  };

  return NextResponse.json(response, { status: 200 });
}
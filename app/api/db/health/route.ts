import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const result = await prisma.$queryRaw<{ now: Date }[]>`
      SELECT NOW() as now
    `;

    return NextResponse.json(
      {
        status: "ok",
        database: "connected",
        timestamp: result[0]?.now ?? new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DB_HEALTH_CHECK_ERROR:", error);

    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        message: "Database connection failed.",
      },
      { status: 500 }
    );
  }
}
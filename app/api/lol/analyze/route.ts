import { NextResponse } from "next/server";
import { z } from "zod";

import { analyzeLolPlayer } from "@/lib/lol-analysis-service";
import { mockLolAnalysisResponse } from "@/lib/mock-lol-analysis";
import { RiotServiceError } from "@/lib/riot";
import type {
  LolAnalysisErrorResponse,
  LolAnalysisResponse,
} from "@/types/lol-analysis";

const lolAnalysisRequestSchema = z.object({
  gameName: z.string().min(2, "gameName en az 2 karakter olmalı."),
  tagLine: z.string().min(2, "tagLine en az 2 karakter olmalı."),
  region: z.enum(["tr1", "euw1", "eun1", "na1", "kr"]),
});

function createErrorResponse(
  code: LolAnalysisErrorResponse["error"]["code"],
  message: string,
  status: number
) {
  const errorResponse: LolAnalysisErrorResponse = {
    error: {
      code,
      message,
    },
  };

  return NextResponse.json(errorResponse, { status });
}

export async function GET() {
  return NextResponse.json(mockLolAnalysisResponse, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = lolAnalysisRequestSchema.safeParse(body);

    if (!parsed.success) {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Gönderilen oyuncu bilgileri geçersiz.",
        400
      );
    }

    const { gameName, tagLine, region } = parsed.data;

    if (!process.env.RIOT_API_KEY) {
      const response: LolAnalysisResponse = {
        ...mockLolAnalysisResponse,
        player: {
          ...mockLolAnalysisResponse.player,
          gameName,
          tagLine,
          region,
        },
      };

      return NextResponse.json(response, { status: 200 });
    }

    const response = await analyzeLolPlayer({
      gameName,
      tagLine,
      region,
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("LOL_ANALYZE_API_ERROR:", error);

    if (error instanceof RiotServiceError) {
      if (error.code === "PLAYER_NOT_FOUND") {
        return createErrorResponse(
          "PLAYER_NOT_FOUND",
          "Oyuncu bulunamadı.",
          404
        );
      }

      if (error.code === "RATE_LIMITED") {
        return createErrorResponse(
          "RATE_LIMITED",
          "Riot API rate limit sınırı aşıldı. Lütfen daha sonra tekrar dene.",
          429
        );
      }

      return createErrorResponse(
        "RIOT_API_ERROR",
        "Riot API isteği sırasında hata oluştu.",
        error.statusCode
      );
    }

    return createErrorResponse(
      "INTERNAL_ERROR",
      "Analiz işlemi sırasında beklenmeyen bir hata oluştu.",
      500
    );
  }
}
import { NextResponse } from "next/server";
import { z } from "zod";

import { mockLolAnalysisResponse } from "@/lib/mock-lol-analysis";
import type {
  LolAnalysisErrorResponse,
  LolAnalysisResponse,
} from "@/types/lol-analysis";

const lolAnalysisRequestSchema = z.object({
  gameName: z.string().min(2, "gameName en az 2 karakter olmalı."),
  tagLine: z.string().min(2, "tagLine en az 2 karakter olmalı."),
  region: z.enum(["tr1", "euw1", "eun1", "na1", "kr"]),
});



export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = lolAnalysisRequestSchema.safeParse(body);

    if (!parsed.success) {
      const errorResponse: LolAnalysisErrorResponse = {
        error: {
          code: "VALIDATION_ERROR",
          message: "Gönderilen oyuncu bilgileri geçersiz.",
        },
      };

      return NextResponse.json(errorResponse, { status: 400 });
    }

    const { gameName, tagLine, region } = parsed.data;

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
  } catch {
    const errorResponse: LolAnalysisErrorResponse = {
      error: {
        code: "INTERNAL_ERROR",
        message: "Analiz işlemi sırasında beklenmeyen bir hata oluştu.",
      },
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }


}
    export async function GET() {
  return NextResponse.json(mockLolAnalysisResponse, { status: 200 });
}
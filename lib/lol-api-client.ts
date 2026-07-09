import type {
  LolAnalysisErrorResponse,
  LolAnalysisRequest,
  LolAnalysisResponse,
  LolPlayerDetailResponse,
  LolRecentPlayersResponse,
} from "@/types/lol-analysis";

export class LolApiClientError extends Error {
  status: number;
  code: string;

  constructor(params: { message: string; status: number; code: string }) {
    super(params.message);
    this.name = "LolApiClientError";
    this.status = params.status;
    this.code = params.code;
  }
}

function isLolAnalysisErrorResponse(
  data: unknown
): data is LolAnalysisErrorResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof data.error === "object" &&
    data.error !== null &&
    "code" in data.error &&
    "message" in data.error &&
    typeof data.error.code === "string" &&
    typeof data.error.message === "string"
  );
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  const data: unknown = await response.json();

  if (!response.ok) {
    if (isLolAnalysisErrorResponse(data)) {
      throw new LolApiClientError({
        message: data.error.message,
        status: response.status,
        code: data.error.code,
      });
    }

    throw new LolApiClientError({
      message: "Bilinmeyen bir API hatası oluştu.",
      status: response.status,
      code: "UNKNOWN_ERROR",
    });
  }

  return data as T;
}

export async function analyzeLolPlayer(
  request: LolAnalysisRequest
): Promise<LolAnalysisResponse> {
  const response = await fetch("/api/lol/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return parseApiResponse<LolAnalysisResponse>(response);
}

export async function getRecentLolPlayers(): Promise<LolRecentPlayersResponse> {
  const response = await fetch("/api/lol/recent", {
    method: "GET",
  });

  return parseApiResponse<LolRecentPlayersResponse>(response);
}

export async function getLolPlayerDetail(
  playerId: number
): Promise<LolPlayerDetailResponse> {
  const response = await fetch(`/api/lol/player/${playerId}`, {
    method: "GET",
  });

  return parseApiResponse<LolPlayerDetailResponse>(response);
}
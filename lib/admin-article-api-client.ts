import type {
  ArticleDetailResponse,
  ArticlesListResponse,
} from "@/types/article";

export class AdminArticleApiError extends Error {
  status: number;
  code: string;

  constructor(params: { message: string; status: number; code: string }) {
    super(params.message);
    this.name = "AdminArticleApiError";
    this.status = params.status;
    this.code = params.code;
  }
}

type ApiErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};

export type CreateArticleRequest = {
  title: string;
  slug: string;
  category: "champion" | "item" | "guide" | "patch" | "news";
  excerpt?: string | null;
  content: string;
  coverImageUrl?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  status: "draft" | "published";
};

function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof data.error === "object" &&
    data.error !== null &&
    "code" in data.error &&
    "message" in data.error
  );
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data: unknown = await response.json();

  if (!response.ok) {
    if (isApiErrorResponse(data)) {
      throw new AdminArticleApiError({
        message: data.error.message,
        status: response.status,
        code: data.error.code,
      });
    }

    throw new AdminArticleApiError({
      message: "Bilinmeyen bir admin API hatası oluştu.",
      status: response.status,
      code: "UNKNOWN_ERROR",
    });
  }

  return data as T;
}

export async function getAdminArticles(
  adminPassword: string
): Promise<ArticlesListResponse> {
  const response = await fetch("/api/admin/articles", {
    method: "GET",
    headers: {
      "x-admin-password": adminPassword,
    },
  });

  return parseResponse<ArticlesListResponse>(response);
}

export async function createAdminArticle(params: {
  adminPassword: string;
  data: CreateArticleRequest;
}): Promise<ArticleDetailResponse> {
  const response = await fetch("/api/admin/articles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": params.adminPassword,
    },
    body: JSON.stringify(params.data),
  });

  return parseResponse<ArticleDetailResponse>(response);
}

export async function getAdminArticleById(params: {
  adminPassword: string;
  articleId: number;
}): Promise<ArticleDetailResponse> {
  const response = await fetch(`/api/admin/articles/${params.articleId}`, {
    method: "GET",
    headers: {
      "x-admin-password": params.adminPassword,
    },
  });

  return parseResponse<ArticleDetailResponse>(response);
}

export async function updateAdminArticle(params: {
  adminPassword: string;
  articleId: number;
  data: CreateArticleRequest;
}): Promise<ArticleDetailResponse> {
  const response = await fetch(`/api/admin/articles/${params.articleId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": params.adminPassword,
    },
    body: JSON.stringify(params.data),
  });

  return parseResponse<ArticleDetailResponse>(response);
}

export type DeleteArticleResponse = {
  deleted: boolean;
  id: number;
};

export async function deleteAdminArticle(params: {
  adminPassword: string;
  articleId: number;
}): Promise<DeleteArticleResponse> {
  const response = await fetch(`/api/admin/articles/${params.articleId}`, {
    method: "DELETE",
    headers: {
      "x-admin-password": params.adminPassword,
    },
  });

  return parseResponse<DeleteArticleResponse>(response);
}
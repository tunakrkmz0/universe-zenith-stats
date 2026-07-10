import { NextResponse } from "next/server";
import { z } from "zod";

import { isAdminRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import type { ArticlesListResponse, ArticleDetailResponse } from "@/types/article";

type ArticleListRecord = {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  status: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type ArticleCreateRecord = ArticleListRecord & {
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
};

const createArticleSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  category: z.enum(["champion", "item", "guide", "patch", "news"]),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(10),
  coverImageUrl: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  status: z.enum(["draft", "published"]).default("draft"),
});

function createPublishedAt(status: string): Date | null {
  if (status === "published") {
    return new Date();
  }

  return null;
}

export async function GET(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json(
        {
          error: {
            code: "UNAUTHORIZED",
            message: "Admin yetkisi gerekli.",
          },
        },
        { status: 401 }
      );
    }

    const articles = (await prisma.article.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        excerpt: true,
        coverImageUrl: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })) as ArticleListRecord[];

    const response: ArticlesListResponse = {
      articles: articles.map((article: ArticleListRecord) => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        category: article.category,
        excerpt: article.excerpt,
        coverImageUrl: article.coverImageUrl,
        status: article.status,
        publishedAt: article.publishedAt,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
      })),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("ADMIN_ARTICLES_LIST_ERROR:", error);

    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Admin yazı listesi alınırken hata oluştu.",
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json(
        {
          error: {
            code: "UNAUTHORIZED",
            message: "Admin yetkisi gerekli.",
          },
        },
        { status: 401 }
      );
    }

    const body: unknown = await request.json();
    const parsed = createArticleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Yazı verisi geçersiz.",
          },
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const article = (await prisma.article.create({
      data: {
        title: data.title,
        slug: data.slug,
        category: data.category,
        excerpt: data.excerpt ?? null,
        content: data.content,
        coverImageUrl: data.coverImageUrl ?? null,
        metaTitle: data.metaTitle ?? null,
        metaDescription: data.metaDescription ?? null,
        status: data.status,
        publishedAt: createPublishedAt(data.status),
      },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        excerpt: true,
        content: true,
        coverImageUrl: true,
        metaTitle: true,
        metaDescription: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })) as ArticleCreateRecord;

    const response: ArticleDetailResponse = {
      article: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        category: article.category,
        excerpt: article.excerpt,
        content: article.content,
        coverImageUrl: article.coverImageUrl,
        metaTitle: article.metaTitle,
        metaDescription: article.metaDescription,
        status: article.status,
        publishedAt: article.publishedAt,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
      },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("ADMIN_ARTICLE_CREATE_ERROR:", error);

    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Yazı oluşturulurken hata oluştu.",
        },
      },
      { status: 500 }
    );
  }
}
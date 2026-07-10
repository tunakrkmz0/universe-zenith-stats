import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import type { ArticlesListResponse } from "@/types/article";

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

export async function GET() {
  try {
    const articles = (await prisma.article.findMany({
      where: {
        status: "published",
      },
      orderBy: {
        publishedAt: "desc",
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
    console.error("ARTICLES_LIST_ERROR:", error);

    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Yazılar alınırken hata oluştu.",
        },
      },
      { status: 500 }
    );
  }
}
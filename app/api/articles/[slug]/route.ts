import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import type { ArticleDetailResponse } from "@/types/article";

type ArticleDetailRecord = {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  status: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const article = (await prisma.article.findFirst({
      where: {
        slug,
        status: "published",
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
    })) as ArticleDetailRecord | null;

    if (!article) {
      return NextResponse.json(
        {
          error: {
            code: "ARTICLE_NOT_FOUND",
            message: "Yazı bulunamadı.",
          },
        },
        { status: 404 }
      );
    }

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

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("ARTICLE_DETAIL_ERROR:", error);

    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Yazı detayı alınırken hata oluştu.",
        },
      },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { z } from "zod";

import { isAdminRequest } from "@/lib/admin-auth";
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

const updateArticleSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  category: z.enum(["champion", "item", "guide", "patch", "news"]),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(10),
  coverImageUrl: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  status: z.enum(["draft", "published"]),
});

function mapArticleToResponse(article: ArticleDetailRecord): ArticleDetailResponse {
  return {
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
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
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

    const { id } = await context.params;
    const articleId = Number(id);

    if (!Number.isInteger(articleId) || articleId <= 0) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Geçersiz yazı ID değeri.",
          },
        },
        { status: 400 }
      );
    }

    const article = (await prisma.article.findUnique({
      where: {
        id: articleId,
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

    return NextResponse.json(mapArticleToResponse(article), { status: 200 });
  } catch (error) {
    console.error("ADMIN_ARTICLE_DETAIL_ERROR:", error);

    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Admin yazı detayı alınırken hata oluştu.",
        },
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
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

    const { id } = await context.params;
    const articleId = Number(id);

    if (!Number.isInteger(articleId) || articleId <= 0) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Geçersiz yazı ID değeri.",
          },
        },
        { status: 400 }
      );
    }

    const body: unknown = await request.json();
    const parsed = updateArticleSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];

      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: firstError
              ? `${firstError.path.join(".")}: ${firstError.message}`
              : "Yazı verisi geçersiz.",
          },
        },
        { status: 400 }
      );
    }

    const existingArticle = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
      select: {
        publishedAt: true,
      },
    });

    if (!existingArticle) {
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

    const data = parsed.data;

    const publishedAt =
      data.status === "published"
        ? existingArticle.publishedAt ?? new Date()
        : null;

    const article = (await prisma.article.update({
      where: {
        id: articleId,
      },
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
        publishedAt,
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
    })) as ArticleDetailRecord;

    return NextResponse.json(mapArticleToResponse(article), { status: 200 });
  } catch (error) {
    console.error("ADMIN_ARTICLE_UPDATE_ERROR:", error);

    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Yazı güncellenirken hata oluştu.",
        },
      },
      { status: 500 }
    );
  }
}



export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
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

    const { id } = await context.params;
    const articleId = Number(id);

    if (!Number.isInteger(articleId) || articleId <= 0) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Geçersiz yazı ID değeri.",
          },
        },
        { status: 400 }
      );
    }

    const existingArticle = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
      select: {
        id: true,
      },
    });

    if (!existingArticle) {
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

    await prisma.article.delete({
      where: {
        id: articleId,
      },
    });

    return NextResponse.json(
      {
        deleted: true,
        id: articleId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("ADMIN_ARTICLE_DELETE_ERROR:", error);

    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Yazı silinirken hata oluştu.",
        },
      },
      { status: 500 }
    );
  }
}
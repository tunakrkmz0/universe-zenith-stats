import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://universezenith.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const articles = await prisma.article.findMany({
    where: {
      status: "published",
    },
    select: {
      slug: true,
      publishedAt: true,
      updatedAt: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/guides`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteUrl}/guides/${article.slug}`,
    lastModified: article.updatedAt ?? article.publishedAt ?? now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...articleRoutes];
}
import { GuidesShowcase } from "@/components/guides/guides-showcase";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type ArticleListRecord = {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: Date | null;
};

export default async function GuidesPage() {
  const articles = (await prisma.article.findMany({
    where: {
      status: "published",
    },
    orderBy: {
      title: "asc",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      excerpt: true,
      coverImageUrl: true,
      publishedAt: true,
    },
  })) as ArticleListRecord[];

  return <GuidesShowcase articles={articles} />;
}

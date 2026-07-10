export type ArticleCategory = "champion" | "item" | "guide" | "patch" | "news";

export type ArticleStatus = "draft" | "published";

export type ArticleListItem = {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  status: string;
  publishedAt: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type ArticleDetail = ArticleListItem & {
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
};

export type ArticlesListResponse = {
  articles: ArticleListItem[];
};

export type ArticleDetailResponse = {
  article: ArticleDetail;
};
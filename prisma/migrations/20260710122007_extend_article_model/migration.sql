-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "coverImageUrl" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'draft';

-- CreateIndex
CREATE INDEX "Article_status_idx" ON "Article"("status");

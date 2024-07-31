/*
  Warnings:

  - A unique constraint covering the columns `[commentId]` on the table `UserComment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `commentId` to the `UserComment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserComment" ADD COLUMN     "commentId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserComment_commentId_key" ON "UserComment"("commentId");

-- AddForeignKey
ALTER TABLE "UserComment" ADD CONSTRAINT "UserComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

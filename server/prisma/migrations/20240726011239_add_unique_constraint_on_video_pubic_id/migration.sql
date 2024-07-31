/*
  Warnings:

  - A unique constraint covering the columns `[videoPublicId]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Video_videoPublicId_key" ON "Video"("videoPublicId");

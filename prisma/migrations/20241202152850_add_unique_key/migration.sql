/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `intervenants` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "intervenants_key_key" ON "intervenants"("key");

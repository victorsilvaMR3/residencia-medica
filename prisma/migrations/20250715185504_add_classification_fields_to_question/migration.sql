/*
  Warnings:

  - You are about to drop the column `year` on the `Question` table. All the data in the column will be lost.
  - Added the required column `ano` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finalidade` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instituicao` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regiao` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tema` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "year",
ADD COLUMN     "ano" INTEGER NOT NULL,
ADD COLUMN     "finalidade" TEXT NOT NULL,
ADD COLUMN     "instituicao" TEXT NOT NULL,
ADD COLUMN     "microtemas" TEXT[],
ADD COLUMN     "regiao" TEXT NOT NULL,
ADD COLUMN     "tema" TEXT NOT NULL;

/*
  Warnings:

  - You are about to drop the column `reservers` on the `Reports` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reports" DROP COLUMN "reservers";
ALTER TABLE "Reports" ADD COLUMN     "reserves" FLOAT8;

-- AlterSequence
ALTER SEQUENCE "Reports_reportId_seq" MAXVALUE 9223372036854775807;

-- AlterSequence
ALTER SEQUENCE "UserTokens_id_seq" MAXVALUE 9223372036854775807;

-- AlterSequence
ALTER SEQUENCE "Users_id_seq" MAXVALUE 9223372036854775807;

-- AlterTable
ALTER TABLE "Reports" ADD COLUMN     "selling_cost" FLOAT8;

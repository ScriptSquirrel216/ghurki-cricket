-- AlterTable
CREATE SEQUENCE batting_id_seq;
ALTER TABLE "batting" ADD COLUMN     "innings" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "id" SET DEFAULT nextval('batting_id_seq');
ALTER SEQUENCE batting_id_seq OWNED BY "batting"."id";

-- AlterTable
CREATE SEQUENCE bowling_id_seq;
ALTER TABLE "bowling" ADD COLUMN     "innings" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "id" SET DEFAULT nextval('bowling_id_seq');
ALTER SEQUENCE bowling_id_seq OWNED BY "bowling"."id";

-- AlterTable
CREATE SEQUENCE expenses_id_seq;
ALTER TABLE "expenses" ALTER COLUMN "id" SET DEFAULT nextval('expenses_id_seq');
ALTER SEQUENCE expenses_id_seq OWNED BY "expenses"."id";

-- AlterTable
CREATE SEQUENCE fielding_id_seq;
ALTER TABLE "fielding" ADD COLUMN     "innings" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "id" SET DEFAULT nextval('fielding_id_seq');
ALTER SEQUENCE fielding_id_seq OWNED BY "fielding"."id";

-- AlterTable
CREATE SEQUENCE innings_id_seq;
ALTER TABLE "innings" ALTER COLUMN "id" SET DEFAULT nextval('innings_id_seq');
ALTER SEQUENCE innings_id_seq OWNED BY "innings"."id";

-- AlterTable
CREATE SEQUENCE matches_id_seq;
ALTER TABLE "matches" ALTER COLUMN "id" SET DEFAULT nextval('matches_id_seq');
ALTER SEQUENCE matches_id_seq OWNED BY "matches"."id";

-- AlterTable
CREATE SEQUENCE records_id_seq;
ALTER TABLE "records" ALTER COLUMN "id" SET DEFAULT nextval('records_id_seq');
ALTER SEQUENCE records_id_seq OWNED BY "records"."id";

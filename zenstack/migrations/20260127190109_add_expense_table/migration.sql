-- CreateTable
CREATE TABLE "expenses" (
    "id" INTEGER NOT NULL,
    "groundFee" INTEGER NOT NULL DEFAULT 0,
    "gearCost" INTEGER NOT NULL DEFAULT 0,
    "foodCost" INTEGER NOT NULL DEFAULT 0,
    "dateId" DATE NOT NULL,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_dateId_fkey" FOREIGN KEY ("dateId") REFERENCES "dates"("date") ON DELETE RESTRICT ON UPDATE CASCADE;

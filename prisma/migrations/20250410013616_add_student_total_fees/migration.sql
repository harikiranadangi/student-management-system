-- CreateTable
CREATE TABLE "StudentTotalFees" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "totalPaidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalDiscountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalFineAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAbacusAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "StudentTotalFees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentTotalFees_studentId_key" ON "StudentTotalFees"("studentId");

-- AddForeignKey
ALTER TABLE "StudentTotalFees" ADD CONSTRAINT "StudentTotalFees_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

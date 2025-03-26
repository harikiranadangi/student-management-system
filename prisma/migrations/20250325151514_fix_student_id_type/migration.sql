-- CreateTable
CREATE TABLE "FeesCollection" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "gradeId" INTEGER NOT NULL,
    "academicYear" TEXT NOT NULL,
    "term" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "totalFees" INTEGER NOT NULL,
    "abacusFees" INTEGER,
    "fineAmount" INTEGER DEFAULT 0,
    "totalReceivedAmount" INTEGER NOT NULL DEFAULT 0,
    "totalDiscountAmount" INTEGER NOT NULL DEFAULT 0,
    "totalDueAmount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Yet to be Paid',

    CONSTRAINT "FeesCollection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeesCollection_studentId_gradeId_term_key" ON "FeesCollection"("studentId", "gradeId", "term");

-- AddForeignKey
ALTER TABLE "FeesCollection" ADD CONSTRAINT "FeesCollection_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeesCollection" ADD CONSTRAINT "FeesCollection_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "FeesStructure"("gradeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "CancelledReceipt" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "originalReceiptNo" TEXT NOT NULL,
    "cancelledDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelledBy" TEXT,
    "reason" TEXT,
    "cancelledAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "cancelledDiscount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "cancelledFine" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "cancelledTotal" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "CancelledReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CancelledReceipt_studentId_idx" ON "CancelledReceipt"("studentId");

-- CreateIndex
CREATE INDEX "CancelledReceipt_term_idx" ON "CancelledReceipt"("term");

-- CreateIndex
CREATE INDEX "CancelledReceipt_originalReceiptNo_idx" ON "CancelledReceipt"("originalReceiptNo");

-- AddForeignKey
ALTER TABLE "CancelledReceipt" ADD CONSTRAINT "CancelledReceipt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

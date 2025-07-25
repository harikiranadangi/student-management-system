-- CreateEnum
CREATE TYPE "LeaveType" AS ENUM ('SICK', 'PERSONAL', 'HALFDAY');

-- CreateTable
CREATE TABLE "PermissionSlip" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "leaveType" "LeaveType" NOT NULL,
    "subReason" TEXT,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeIssued" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PermissionSlip_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PermissionSlip" ADD CONSTRAINT "PermissionSlip_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

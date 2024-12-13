-- DropIndex
DROP INDEX `Teacher_email_key` ON `teacher`;

-- AlterTable
ALTER TABLE `teacher` MODIFY `phone` VARCHAR(191) NULL;

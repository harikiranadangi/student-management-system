-- AlterTable
ALTER TABLE `class` ADD COLUMN `homeworkId` INTEGER NULL;

-- AlterTable
ALTER TABLE `subject` ADD COLUMN `homeworkId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Homework` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Class` ADD CONSTRAINT `Class_homeworkId_fkey` FOREIGN KEY (`homeworkId`) REFERENCES `Homework`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subject` ADD CONSTRAINT `Subject_homeworkId_fkey` FOREIGN KEY (`homeworkId`) REFERENCES `Homework`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

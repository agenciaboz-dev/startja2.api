/*
  Warnings:

  - A unique constraint covering the columns `[address_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `address_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cep` VARCHAR(191) NOT NULL,
    `uf` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `street` VARCHAR(191) NOT NULL,
    `complement` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_address_id_key` ON `User`(`address_id`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `Address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

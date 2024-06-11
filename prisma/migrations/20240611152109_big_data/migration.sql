/*
  Warnings:

  - You are about to drop the column `address_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `cpf` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profilePic` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_address_id_fkey`;

-- DropIndex
DROP INDEX `User_cpf_key` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `address_id`,
    DROP COLUMN `cpf`,
    DROP COLUMN `profilePic`,
    ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `admin` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `profilePicId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Customer` (
    `id` VARCHAR(191) NOT NULL,
    `document` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `business_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `municipal_registration` VARCHAR(191) NOT NULL,
    `state_registration` VARCHAR(191) NOT NULL,
    `exempted` BOOLEAN NOT NULL,
    `discriminate_taxes` BOOLEAN NOT NULL,
    `send_destinatary_mail` BOOLEAN NOT NULL,
    `enable_nfe` BOOLEAN NOT NULL,
    `enable_nfce` BOOLEAN NOT NULL,
    `next_nfe_number` VARCHAR(191) NOT NULL,
    `nfe_series` VARCHAR(191) NOT NULL,
    `funrural` ENUM('paycheck', 'production_value') NOT NULL,
    `certificate_file` TEXT NOT NULL,
    `certificate_password` TEXT NOT NULL,
    `profilePicId` VARCHAR(191) NULL,
    `address_id` INTEGER NOT NULL,
    `permissionsId` INTEGER NOT NULL,
    `managerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Customer_profilePicId_key`(`profilePicId`),
    UNIQUE INDEX `Customer_address_id_key`(`address_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Media` (
    `id` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('image', 'document') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NfePermissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `emit` BOOLEAN NOT NULL,
    `edit` BOOLEAN NOT NULL,
    `cancel` BOOLEAN NOT NULL,
    `delete` BOOLEAN NOT NULL,
    `transmit` BOOLEAN NOT NULL,
    `clone` BOOLEAN NOT NULL,
    `adjust` BOOLEAN NOT NULL,
    `renderNumber` BOOLEAN NOT NULL,
    `manifest` BOOLEAN NOT NULL,
    `correctionLetter` BOOLEAN NOT NULL,
    `share` BOOLEAN NOT NULL,
    `download` BOOLEAN NOT NULL,
    `history` BOOLEAN NOT NULL,
    `save_view` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerPermissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `enterprises` INTEGER NOT NULL,
    `products` INTEGER NOT NULL,
    `natures` INTEGER NOT NULL,
    `properties` INTEGER NOT NULL,
    `bank_accounts` INTEGER NOT NULL,
    `edit_permissions` BOOLEAN NOT NULL,
    `invite_user` BOOLEAN NOT NULL,
    `options` BOOLEAN NOT NULL,
    `report_nfe` INTEGER NOT NULL,
    `sold_products` INTEGER NOT NULL,
    `chart_accounts` INTEGER NOT NULL,
    `nfePermissionsId` INTEGER NOT NULL,

    UNIQUE INDEX `CustomerPermissions_nfePermissionsId_key`(`nfePermissionsId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerUser` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `customer_id` VARCHAR(191) NOT NULL,
    `permissions_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Resale` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `profilePicId` VARCHAR(191) NULL,
    `managerId` VARCHAR(191) NOT NULL,
    `permissionsId` INTEGER NOT NULL,

    UNIQUE INDEX `Resale_profilePicId_key`(`profilePicId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResalePermissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customers` INTEGER NOT NULL,
    `products` INTEGER NOT NULL,
    `natures` INTEGER NOT NULL,
    `editPermissions` BOOLEAN NOT NULL,
    `inviteUser` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResaleUser` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `resale_id` VARCHAR(191) NOT NULL,
    `permissions_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_profilePicId_fkey` FOREIGN KEY (`profilePicId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `Address`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_permissionsId_fkey` FOREIGN KEY (`permissionsId`) REFERENCES `CustomerPermissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerPermissions` ADD CONSTRAINT `CustomerPermissions_nfePermissionsId_fkey` FOREIGN KEY (`nfePermissionsId`) REFERENCES `NfePermissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_profilePicId_fkey` FOREIGN KEY (`profilePicId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerUser` ADD CONSTRAINT `CustomerUser_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerUser` ADD CONSTRAINT `CustomerUser_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerUser` ADD CONSTRAINT `CustomerUser_permissions_id_fkey` FOREIGN KEY (`permissions_id`) REFERENCES `CustomerPermissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resale` ADD CONSTRAINT `Resale_profilePicId_fkey` FOREIGN KEY (`profilePicId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resale` ADD CONSTRAINT `Resale_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resale` ADD CONSTRAINT `Resale_permissionsId_fkey` FOREIGN KEY (`permissionsId`) REFERENCES `ResalePermissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResaleUser` ADD CONSTRAINT `ResaleUser_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResaleUser` ADD CONSTRAINT `ResaleUser_resale_id_fkey` FOREIGN KEY (`resale_id`) REFERENCES `Resale`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResaleUser` ADD CONSTRAINT `ResaleUser_permissions_id_fkey` FOREIGN KEY (`permissions_id`) REFERENCES `ResalePermissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

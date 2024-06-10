-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `created_at` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `profilePic` TEXT NULL,
    `expoPushToken` TEXT NOT NULL DEFAULT '[]',

    UNIQUE INDEX `User_cpf_key`(`cpf`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `viewed` BOOLEAN NOT NULL DEFAULT false,
    `title` TEXT NOT NULL DEFAULT '',
    `image` TEXT NOT NULL DEFAULT '',
    `body` TEXT NOT NULL,
    `datetime` VARCHAR(191) NOT NULL,
    `target_route` VARCHAR(191) NOT NULL,
    `target_param` TEXT NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `expoPushToken` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[profilePicId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `User_profilePicId_key` ON `User`(`profilePicId`);

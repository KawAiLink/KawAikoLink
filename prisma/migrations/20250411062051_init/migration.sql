-- CreateEnum
CREATE TYPE "Mode" AS ENUM ('FRIEND_MODE', 'DATE_MODE');

-- CreateEnum
CREATE TYPE "FemboyRole" AS ENUM ('IS_ONE', 'INTERESTED_IN');

-- CreateEnum
CREATE TYPE "SexualOrientation" AS ENUM ('STRAIGHT', 'GAY', 'BISEXUAL', 'PANSEXUAL', 'ASEXUAL', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "bio" TEXT,
    "age" INTEGER,
    "avatarUrl" TEXT,
    "hobbies" TEXT[],
    "country" TEXT,
    "secretKey" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Preferences" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "mode" "Mode" NOT NULL,
    "femboy" "FemboyRole" NOT NULL,
    "sexualOrientation" "SexualOrientation",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_secretKey_key" ON "User"("secretKey");

-- CreateIndex
CREATE UNIQUE INDEX "Preferences_userId_key" ON "Preferences"("userId");

-- AddForeignKey
ALTER TABLE "Preferences" ADD CONSTRAINT "Preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

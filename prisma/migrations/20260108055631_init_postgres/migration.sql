-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('CAR', 'BIKE', 'SCOOTER');

-- CreateEnum
CREATE TYPE "TrainerType" AS ENUM ('INDEPENDENT', 'DRIVING_SCHOOL');

-- CreateEnum
CREATE TYPE "TrainerStatus" AS ENUM ('PENDING', 'APPROVED', 'SUSPENDED');

-- CreateTable
CREATE TABLE "Trainer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "experience" INTEGER NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "trainerName" TEXT NOT NULL,
    "packageName" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "customerName" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "trainerId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "vehicleNumber" TEXT NOT NULL,
    "dualControl" BOOLEAN NOT NULL,
    "insured" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Trainer_mobile_key" ON "Trainer"("mobile");

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

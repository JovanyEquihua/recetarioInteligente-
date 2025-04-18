/*
  Warnings:

  - The primary key for the `VerificationToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `VerificationToken` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[email]` on the table `VerificationToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Tipo` to the `Ingrediente` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `dificultad` on the `Receta` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `nombreSabor` on the `TipoSabor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TipoIngrediente" AS ENUM ('Verduras', 'Frutas', 'Cereales', 'Alimentos_de_origen_animal', 'Leguminosas');

-- CreateEnum
CREATE TYPE "DificultadReceta" AS ENUM ('Facil', 'Medio', 'Dificil');

-- CreateEnum
CREATE TYPE "NombreSabor" AS ENUM ('Dulce', 'Salado', 'Amargo', 'Acido', 'Umami');

-- DropIndex
DROP INDEX "TipoSabor_nombreSabor_key";

-- AlterTable
ALTER TABLE "Ingrediente" ADD COLUMN     "Tipo" "TipoIngrediente" NOT NULL;

-- AlterTable
ALTER TABLE "Receta" DROP COLUMN "dificultad",
ADD COLUMN     "dificultad" "DificultadReceta" NOT NULL;

-- AlterTable
ALTER TABLE "TipoSabor" DROP COLUMN "nombreSabor",
ADD COLUMN     "nombreSabor" "NombreSabor" NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "biografia" TEXT,
ADD COLUMN     "primerInicioSesion" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "titulo" TEXT,
ADD COLUMN     "verificado" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "VerificationToken" DROP CONSTRAINT "VerificationToken_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_email_key" ON "VerificationToken"("email");

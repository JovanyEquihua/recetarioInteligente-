/*
  Warnings:

  - You are about to drop the column `descripcion` on the `Receta` table. All the data in the column will be lost.
  - Added the required column `pasosPreparacion` to the `Receta` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Calificacion" DROP CONSTRAINT "Calificacion_recetaId_fkey";

-- DropForeignKey
ALTER TABLE "Comentario" DROP CONSTRAINT "Comentario_recetaId_fkey";

-- DropForeignKey
ALTER TABLE "Favorito" DROP CONSTRAINT "Favorito_recetaId_fkey";

-- DropForeignKey
ALTER TABLE "RecetaIngrediente" DROP CONSTRAINT "RecetaIngrediente_recetaId_fkey";

-- DropForeignKey
ALTER TABLE "Reporte" DROP CONSTRAINT "Reporte_recetaId_fkey";

-- AlterTable
ALTER TABLE "Receta" DROP COLUMN "descripcion",
ADD COLUMN     "pasosPreparacion" JSONB NOT NULL;

-- AddForeignKey
ALTER TABLE "RecetaIngrediente" ADD CONSTRAINT "RecetaIngrediente_recetaId_fkey" FOREIGN KEY ("recetaId") REFERENCES "Receta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_recetaId_fkey" FOREIGN KEY ("recetaId") REFERENCES "Receta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_recetaId_fkey" FOREIGN KEY ("recetaId") REFERENCES "Receta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorito" ADD CONSTRAINT "Favorito_recetaId_fkey" FOREIGN KEY ("recetaId") REFERENCES "Receta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_recetaId_fkey" FOREIGN KEY ("recetaId") REFERENCES "Receta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

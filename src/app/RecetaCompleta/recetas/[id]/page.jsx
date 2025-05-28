import DetallesSection from "@/app/components/recipe/DetallesSection";
import HeaderReceta from "@/app/components/recipe/HeaderReceta";
import IngredientesSection from "@/app/components/recipe/IngredienteSection";
import PasosSection from "@/app/components/recipe/PasosSection";
import FavoritoButton from "@/app/components/recipe/FavoritoButton";
import ModoCocina from "@/app/recetas/ModoCocina";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/authOptions";
import { db as prisma } from "@/libs/db";


async function getReceta(id) {
  const receta = await prisma.receta.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      ingredientes: {
        include: {
          ingrediente: true, // Incluye los detalles del ingrediente
        },
      },
      usuario: true, // Incluye los detalles del usuario
      tipoComida: true, // Incluye los detalles del tipo de comida
    },
  });

  if (!receta) {
    throw new Error("Receta no encontrada");
  }

  return receta;
}

export default async function RecetaPage({ params }) {
  const recetaId = parseInt(params.id);

  const receta = await getReceta(recetaId);
  //console.log("Receta:", receta);
  const session = await getServerSession(authOptions);
  const usuarioId = session?.user?.id;
  const usuarioNombre = session?.user?.nombre;

  let esFavoritoInicial = false;

  if (usuarioId) {
    const favorito = await prisma.favorito.findFirst({
      where: {
        recetaId: parseInt(params.id),
        usuarioId: parseInt(usuarioId),
      },
    });
    esFavoritoInicial = !!favorito;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-10 relative ">
      <div className="absolute top-6 right-6 z-10">
        <FavoritoButton
          recetaId={params.id}
          usuarioId={usuarioId}
          esFavoritoInicial={esFavoritoInicial}
        />
      </div>

      <HeaderReceta receta={receta} />

      <div className="mb-14">
        {Array.isArray(receta.pasosPreparacion) &&
          receta.pasosPreparacion.length > 0 && (
            <ModoCocina pasos={receta.pasosPreparacion} />
          )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
        <IngredientesSection ingredientes={receta.ingredientes} />
        <DetallesSection receta={receta} />
      </div>

      <PasosSection pasosPreparacion={receta.pasosPreparacion} />
    </div>
  );
}

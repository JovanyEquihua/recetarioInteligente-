import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mapeo entre tipo de comida y país
const comidaAPais = {
  Mexicana: 'México',
  Japonesa: 'Japón',
  Italiana: 'Italia',
  India: 'India',
  Francesa: 'Francia',
  China: 'China',
  Estadounidense: 'Estados Unidos',
  Peruana: 'Perú',
  // Agrega más si es necesario
};

export default async function handler(req, res) {
  try {
    const recetas = await prisma.receta.findMany({
      include: {
        tipoComida: true,
        usuario: {
          select: {
            nombreUsuario: true,
          },
        },
      },
    });

    const recetasPorPais = {};

    recetas.forEach((receta) => {
      const tipo = receta.tipoComida?.nombre;
      const pais = comidaAPais[tipo];

      if (!pais) return;

      if (!recetasPorPais[pais]) recetasPorPais[pais] = [];

      recetasPorPais[pais].push({
        id: receta.id,
        titulo: receta.titulo,
        imagen: receta.imagen,
        usuario: receta.usuario.nombreUsuario,
      });
    });

    res.status(200).json(recetasPorPais);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener recetas' });
  }
}

// src/app/api/recetas/paises/route.js
import { db } from "@/libs/db";

// Mapeo entre tipo de comida y país
const comidaAPais = {
  mexicana: "México",
  japonesa: "Japón",
  italiana: "Italia",
  india: "India",
  francesa: "Francia",
  china: "China",
  estadounidense: "Estados Unidos",
  peruana: "Perú",
};

// Info extra por país
const infoPaises = {
  México: {
    lat: 23.6345,
    lng: -102.5528,
    bandera: "🇲🇽",
    color: "#006847",
  },
  Japón: {
    lat: 36.2048,
    lng: 138.2529,
    bandera: "🇯🇵",
    color: "#bc002d",
  },
  Italia: {
    lat: 41.8719,
    lng: 12.5674,
    bandera: "🇮🇹",
    color: "#008C45",
  },
  India: {
    lat: 20.5937,
    lng: 78.9629,
    bandera: "🇮🇳",
    color: "#FF9933",
  },
  Francia: {
    lat: 46.6034,
    lng: 1.8883,
    bandera: "🇫🇷",
    color: "#0055A4",
  },
  China: {
    lat: 35.8617,
    lng: 104.1954,
    bandera: "🇨🇳",
    color: "#DE2910",
  },
  "Estados Unidos": {
    lat: 37.0902,
    lng: -95.7129,
    bandera: "🇺🇸",
    color: "#3C3B6E",
  },
  Perú: {
    lat: -9.19,
    lng: -75.0152,
    bandera: "🇵🇪",
    color: "#D91023",
  },
};

// Función para normalizar texto
function normalizarTexto(texto) {
  return texto
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export async function GET() {
  try {
    const recetas = await db.receta.findMany({
      include: {
        tipoComida: true,
      },
    });

    const agrupadasPorPais = {};

    recetas.forEach((receta) => {
      const tipo = receta.tipoComida?.nombre;
      const tipoNormalizado = normalizarTexto(tipo);
      const pais = comidaAPais[tipoNormalizado];
      if (!pais) return;

      if (!agrupadasPorPais[pais]) {
        agrupadasPorPais[pais] = [];
      }

      agrupadasPorPais[pais].push({
        id: receta.id,
        nombre: receta.titulo,
        imagen: receta.imagen,
      });
    });

    const resultado = Object.entries(agrupadasPorPais).map(([pais, recetas], index) => {
      const info = infoPaises[pais];
      return {
        id: index + 1,
        pais,
        lat: info?.lat,
        lng: info?.lng,
        bandera: info?.bandera,
        color: info?.color,
        recetas,
      };
    });

    return new Response(JSON.stringify(resultado), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al obtener recetas por país:", error.message, error.stack);
    return new Response(
      JSON.stringify({ error: "Error al obtener recetas" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

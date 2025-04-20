// pages/api/tipos.js

import { db } from "@/libs/db"


export async function GET() {
    try {
      const tiposComida = await db.tipoComida.findMany();
      const tiposSabor = await db.tipoSabor.findMany();
  
      return new Response(
        JSON.stringify({ tiposComida, tiposSabor }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error al obtener tipos:", error);
      return new Response(
        JSON.stringify({ error: "Error al obtener tipos" }),
        { status: 500 }
      );
    }
  }

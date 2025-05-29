import { db } from "@/libs/db";
import { NextResponse } from "next/server";
import { subDays, subWeeks, formatISO } from "date-fns";

export async function GET(req) {
  try {
    const ahora = new Date();

    const ultimaSemana = subDays(ahora, 6); // últimos 7 días
    const ultimoMes = subWeeks(ahora, 4); // últimas 4 semanas

    const logs = await db.log.findMany({
      where: {
        timestamp: {
          gte: ultimoMes,
        },
      },
      select: {
        timestamp: true,
      },
    });

    const semanal = {};
    const mensual = {};

    logs.forEach((log) => {
      const fecha = new Date(log.timestamp);

      // Agrupar por día (semanal)
      if (fecha >= ultimaSemana) {
        const dia = fecha.toISOString().split("T")[0];
        semanal[dia] = (semanal[dia] || 0) + 1;
      }

      // Agrupar por semana (mensual)
      const semana = `${fecha.getFullYear()}-W${getWeekNumber(fecha)}`;
      mensual[semana] = (mensual[semana] || 0) + 1;
    });

    return NextResponse.json({
      semanal,
      mensual,
    });
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}

// Función auxiliar para agrupar por semana
function getWeekNumber(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  return weekNo;
}

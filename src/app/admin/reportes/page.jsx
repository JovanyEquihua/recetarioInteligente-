"use client";
import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function ConfigPage() {
  const [semanal, setSemanal] = useState([]);
  const [mensual, setMensual] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/estadisticas/conexiones");
      const data = await res.json();

      if (data.semanal) {
        const datosSemanal = Object.entries(data.semanal).map(([fecha, cantidad]) => ({
          fecha,
          cantidad
        }));
        setSemanal(datosSemanal);
      }

      if (data.mensual) {
        const datosMensual = Object.entries(data.mensual).map(([semana, cantidad]) => ({
          semana,
          cantidad
        }));
        setMensual(datosMensual);
      }
    };

    fetchData();
  }, []);

    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Configuración y Reportes</h2>
        <p>Ajusta configuraciones del sistema y revisa reportes de actividad.</p>

        <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Conexiones Semanales</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={semanal}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cantidad" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Conexiones Mensuales</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mensual}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="semana" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cantidad" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      </div>
    );
  }
  
"use client";
import { useEffect, useState } from "react";

const logTypes = {
  login: "Inicios de sesión",
  recetas: "Acciones en recetas",
  comentarios: "Comentarios",
  admin: "Acciones administrativas",
};

export default function DashboardPage() {
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState("login");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`/api/logs/${selectedLog}`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setLogs(data);
        } else {
          console.error("Formato de datos inesperado:", data);
          setLogs([]);
        }
      } catch (err) {
        console.error("Error al cargar logs:", err);
        setLogs([]);
      }
    };

    fetchLogs();
  }, [selectedLog]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {/* Botones para cambiar de log */}
      <div className="flex gap-2 mb-4">
        {Object.entries(logTypes).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedLog(key)}
            className={`px-4 py-2 rounded ${
              selectedLog === key
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tabla */}
      {logs.length > 0 ? (
        <table className="min-w-full border border-gray-300 text-sm">
          <thead>
            <tr>
              <th className="border px-4 py-2">Usuario</th>
              <th className="border px-4 py-2">IP</th>
              <th className="border px-4 py-2">Hora</th>
              <th className="border px-4 py-2">Acción</th>
              <th className="border px-4 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{log.usuario || "-"}</td>
                <td className="border px-4 py-2">{log.ip || "-"}</td>
                <td className="border px-4 py-2">{log.timestamp || "-"}</td>
                <td className="border px-4 py-2">{log.reason || "-"}</td>
                <td className="border px-4 py-2">{log.status || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay logs de {logTypes[selectedLog]}.</p>
      )}
    </div>
  );
}

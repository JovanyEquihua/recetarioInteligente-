"use client";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/logs/login");
        const data = await res.json();

        if (Array.isArray(data)) {
          setLogs(data);
        } else {
          console.error("Formato de datos inesperado:", data);
          setLogs([]); // o mostrar error
        }
      } catch (err) {
        console.error("Error al cargar logs:", err);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      {logs.length > 0 ? (
        <table className="min-w-full border border-gray-300 text-sm">
          <thead>
            <tr>
              <th className="border px-4 py-2">Usuario</th>
              <th className="border px-4 py-2">IP</th>
              <th className="border px-4 py-2">Hora</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{log.email || "-"}</td>
                <td className="border px-4 py-2">{log.ip || "-"}</td>
                <td className="border px-4 py-2">{log.timestamp || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay logs de inicio de sesión.</p>
      )}
    </div>
  );
}

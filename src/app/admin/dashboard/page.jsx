"use client";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

async function generarPDF(selectedLog) {
  const res = await fetch(`/api/logs/${selectedLog}`);
  const data = await res.json();

  const doc = new jsPDF();
  doc.text(`Reporte de ${selectedLog}`, 14, 10);

  // Definir columnas según el tipo de log
  let head = [];
  let body = [];

  switch (selectedLog) {
    case "login":
      head = [["Usuario/Email", "IP", "Fecha/Hora", "Estado", "Razón"]];
      body = data.map((log) => [
        log.usuario || log.email || "-",
        log.ip || "-",
        new Date(log.timestamp).toLocaleString(),
        log.status || "-",
        log.reason || "-",
      ]);
      break;

    case "recetas":
      head = [["Usuario", "Acción", "ID Receta", "Estado", "Fecha/Hora"]];
      body = data.map((log) => [
      log.usuarioId || "-",
      log.accion || "-",
      log.recetaId || "-",
      log.status || "-",
      new Date(log.timestamp).toLocaleString(),
    ]);
    break;


    case "comentarios":
      head = [["Usuario", "Comentario", "ID Receta", "Fecha/Hora"]];
      body = data.map((log) => [
        log.usuario || "-",
        log.comentario || "-",
        log.recetaId || "-",
        new Date(log.timestamp).toLocaleString(),
      ]);
      break;

    case "admin":
      head = [["Admin", "Acción", "Entidad", "Fecha/Hora"]];
      body = data.map((log) => [
        log.usuario || "-",
        log.accion || "-",
        log.entidad || "-",
        new Date(log.timestamp).toLocaleString(),
      ]);
      break;

    default:
      head = [["Datos"]];
      body = data.map((log) => [JSON.stringify(log)]);
  }

  autoTable(doc, { startY: 20, head, body });
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reporte_${selectedLog}.pdf`;
  a.click();

  const formData = new FormData();
  formData.append("file", blob, `reporte_${selectedLog}.pdf`);

  await fetch("/api/upload-to-drive", {
    method: "POST",
    body: formData,
  });
}

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

  const renderTableHeader = () => {
    switch (selectedLog) {
      case "login":
        return (
          <tr>
            <th className="border px-4 py-2">Usuario/Email</th>
            <th className="border px-4 py-2">IP</th>
            <th className="border px-4 py-2">Hora</th>
            <th className="border px-4 py-2">Estado</th>
            <th className="border px-4 py-2">Razón</th>
          </tr>
        );
      case "recetas":
        return (
          <tr>
            <th className="border px-4 py-2">Usuario</th>
            <th className="border px-4 py-2">Acción</th>
            <th className="border px-4 py-2">ID Receta</th>
            <th className="border px-4 py-2">Estado</th>
            <th className="border px-4 py-2">Hora</th>
          </tr>
        );

      case "comentarios":
        return (
          <tr>
            <th className="border px-4 py-2">Usuario</th>
            <th className="border px-4 py-2">Comentario</th>
            <th className="border px-4 py-2">ID Receta</th>
            <th className="border px-4 py-2">Hora</th>
          </tr>
        );
      case "admin":
        return (
          <tr>
            <th className="border px-4 py-2">Admin</th>
            <th className="border px-4 py-2">Acción</th>
            <th className="border px-4 py-2">Entidad</th>
            <th className="border px-4 py-2">Hora</th>
          </tr>
        );
      default:
        return null;
    }
  };

  const renderTableRows = () => {
    return logs.map((log, index) => {
      switch (selectedLog) {
        case "login":
          return (
            <tr key={index}>
              <td className="border px-4 py-2">{log.usuario || "-"}</td>
              <td className="border px-4 py-2">{log.ip || "-"}</td>
              <td className="border px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
              <td className="border px-4 py-2">{log.status || "-"}</td>
              <td className="border px-4 py-2">{log.reason || "-"}</td>
            </tr>
          );
        case "recetas":
          return (
            <tr key={index}>
              <td className="border px-4 py-2">{log.usuarioId || "-"}</td>
              <td className="border px-4 py-2">{log.accion || "-"}</td>
              <td className="border px-4 py-2">{log.recetaId || "-"}</td>
              <td className="border px-4 py-2">{log.status || "-"}</td>
              <td className="border px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          );

        case "comentarios":
          return (
            <tr key={index}>
              <td className="border px-4 py-2">{log.usuario || "-"}</td>
              <td className="border px-4 py-2">{log.comentario || "-"}</td>
              <td className="border px-4 py-2">{log.recetaId || "-"}</td>
              <td className="border px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          );
        case "admin":
          return (
            <tr key={index}>
              <td className="border px-4 py-2">{log.usuario || "-"}</td>
              <td className="border px-4 py-2">{log.accion || "-"}</td>
              <td className="border px-4 py-2">{log.entidad || "-"}</td>
              <td className="border px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="flex gap-2 mb-4">
        {Object.entries(logTypes).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedLog(key)}
            className={`px-4 py-2 rounded ${
              selectedLog === key ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {label}
          </button>
        ))}
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => generarPDF(selectedLog)}
        >
          Descargar PDF y subir a Drive
        </button>
      </div>

      {logs.length > 0 ? (
        <table className="min-w-full border border-gray-300 text-sm">
          <thead>{renderTableHeader()}</thead>
          <tbody>{renderTableRows()}</tbody>
        </table>
      ) : (
        <p>No hay logs de {logTypes[selectedLog]}.</p>
      )}
    </div>
  );
}

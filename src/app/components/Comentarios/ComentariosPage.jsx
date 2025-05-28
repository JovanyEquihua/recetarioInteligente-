"use client";
import React, { useState, useEffect } from "react";

const ComentariosPage = ({ recetaId, usuario }) => {
  const [comentarios, setComentarios] = useState([]);
  const [comentarioNuevo, setComentarioNuevo] = useState("");
  const [cargando, setCargando] = useState(false);

  // Cargar comentarios de la base de datos
  useEffect(() => {
    if (!recetaId) return;
    const obtenerComentarios = async () => {
      try {
        const res = await fetch(`/api/comentarios?recetaId=${recetaId}`);
        const data = await res.json();
        setComentarios(data);
      } catch (error) {
        console.error("Error al cargar comentarios:", error);
      }
    };

    obtenerComentarios();
  }, [recetaId]);

  // Enviar un nuevo comentario
  const enviarComentario = async () => {
    if (!comentarioNuevo.trim()) return;

    setCargando(true);
    try {
      const res = await fetch("/api/receta/comentar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recetaId,
          comentario: comentarioNuevo,
          usuarioId: usuario?.id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setComentarios((prev) => [...prev, data]);
        setComentarioNuevo("");
      } else {
        console.error("Error al comentar:", data.error);
      }
    } catch (error) {
      console.error("Error al enviar comentario:", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Comentarios</h3>

      {comentarios.length === 0 ? (
        <p className="text-sm text-gray-500">No hay comentarios aún.</p>
      ) : (
        <ul className="space-y-4">
          {comentarios.map((c, index) => (
            <li key={index} className="bg-gray-100 rounded-lg p-3">
              <p className="text-sm text-gray-700">{c.comentario}</p>
              <span className="text-xs text-gray-500">– {c.usuario?.nombre || "Anónimo"}</span>
            </li>
          ))}
        </ul>
      )}

      {usuario ? (
        <div className="mt-6">
          <textarea
            value={comentarioNuevo}
            onChange={(e) => setComentarioNuevo(e.target.value)}
            placeholder="Escribe tu comentario..."
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            rows={3}
          />
          <button
            onClick={enviarComentario}
            disabled={cargando}
            className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {cargando ? "Enviando..." : "Comentar"}
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-500 mt-4">
          Inicia sesión para dejar un comentario.
        </p>
      )}
    </div>
  );
};

export default ComentariosPage;

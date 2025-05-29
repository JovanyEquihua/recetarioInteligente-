"use client";
import React, { useState, useEffect } from "react";
import { MdOutlineDeleteOutline, MdEdit } from "react-icons/md";

const ComentariosPage = ({ recetaId, usuario }) => {
  const [comentarios, setComentarios] = useState([]);
  const [comentarioNuevo, setComentarioNuevo] = useState("");
  const [cargando, setCargando] = useState(false);
  const [comentarioEditandoId, setComentarioEditandoId] = useState(null);
  const [comentarioEditado, setComentarioEditado] = useState("");

  useEffect(() => {
    if (!recetaId) return;
    const obtenerComentarios = async () => {
      try {
        const res = await fetch(`/api/receta/comentar?recetaId=${recetaId}`);
        const data = await res.json();
        setComentarios(data);
      } catch (error) {
        console.error("Error al cargar comentarios:", error);
      }
    };

    obtenerComentarios();
  }, [recetaId]);

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

      if (res.ok) {
        setComentarioNuevo("");
        const resComentarios = await fetch(
          `/api/receta/comentar?recetaId=${recetaId}`
        );
        const dataComentarios = await resComentarios.json();
        setComentarios(dataComentarios);
      }
    } catch (error) {
      console.error("Error al enviar comentario:", error);
    } finally {
      setCargando(false);
    }
  };

  const iniciarEdicion = (comentario) => {
  setComentarioEditandoId(comentario.id);
  setComentarioEditado(comentario.comentario);
};

const handleBorrar = async (comentarioId) => {
  try {
    const res = await fetch(`/api/receta/comentar`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        comentarioId,
        usuarioId: usuario?.id,
      }),
    });

    if (res.ok) {
      setComentarios((prev) => prev.filter((c) => c.id !== comentarioId));
    } else {
      const err = await res.json();
      console.error("Error:", err.error);
    }
  } catch (error) {
    console.error("Error al borrar comentario:", error);
  }
};


const guardarEdicion = async (comentarioId) => {
  try {
    const res = await fetch(`/api/receta/comentar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        comentarioId,
        comentario: comentarioEditado,
        usuarioId: usuario?.id,
      }),
    });
    if (res.ok) {
      const actualizados = comentarios.map((c) =>
        c.id === comentarioId ? { ...c, comentario: comentarioEditado } : c
      );
      setComentarios(actualizados);
      setComentarioEditandoId(null);
      setComentarioEditado("");
    }
  } catch (error) {
    console.error("Error al editar comentario:", error);
  }
};


  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Comentarios</h3>

      {comentarios.length === 0 ? (
        <p className="text-sm text-gray-500">No hay comentarios aún.</p>
      ) : (
        <ul className="space-y-4">
          {comentarios.map((c) => (
            <li
              key={c.id}
              className="bg-white rounded-lg p-4 shadow-md flex gap-3 items-start relative shadow-[#ccddab] "
            >
              <img
                src={c.usuario?.fotoPerfil || "/default-profile.png"}
                alt="Perfil"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800 text-sm">
                    {c.usuario?.nombre || "Anónimo"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(c.fechaComentario).toLocaleDateString()}
                  </span>
                </div>
                {comentarioEditandoId === c.id ? (
                  <div className="mt-2">
                    <textarea
                      value={comentarioEditado}
                      onChange={(e) => setComentarioEditado(e.target.value)}
                      rows={2}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d37bb3]"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => guardarEdicion(c.id)}
                        className="text-sm bg-[#8B1C62] text-white px-3 py-1 rounded hover:bg-[#d37bb3]"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setComentarioEditandoId(null)}
                        className="text-sm bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700 mt-1">{c.comentario}</p>
                )}
              </div>

              {usuario?.id === c.usuarioId && (
                <div className="absolute top-10 right-2 flex gap-2 mr-1">
                  <button
                    onClick={() => iniciarEdicion(c)}
                    title="Editar"
                    className="text-gray-500 hover:text-[#d37bb3]"
                  >
                    <MdEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleBorrar(c.id)}
                    title="Eliminar"
                    className="text-gray-500 hover:text-red-500"
                  >
                    <MdOutlineDeleteOutline size={18} />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {usuario.id ? (
        <div className="mt-6">
          <textarea
            value={comentarioNuevo}
            onChange={(e) => setComentarioNuevo(e.target.value)}
            placeholder="Escribe tu comentario..."
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#738b43]"
            rows={3}
          />
          <button
            onClick={enviarComentario}
            disabled={cargando}
            className="mt-2 px-4 py-2 bg-[#6B8E23] text-white rounded-md hover:bg-[#738b43] disabled:opacity-50"
          >
            {cargando ? "Enviando..." : "Comentar"}
          </button>
        </div>
      ) : (
        <div className="mt-6 relative group">
          <textarea
            placeholder="Inicia sesión para dejar un comentario"
            readOnly
            className="w-full border border-gray-300 rounded-md p-2 text-sm bg-gray-100 cursor-not-allowed text-gray-500"
            rows={3}
          />
          <button
            disabled
            className="mt-2 px-4 py-2 bg-gray-300 text-white rounded-md cursor-not-allowed w-full"
          >
            Comentar
          </button>
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 hidden group-hover:block z-20 bg-[#b6d37d] text-sm text-white shadow-md px-4 py-2 rounded-md border border-gray-200">
            Inicia sesión para dejar un comentario
          </div>
        </div>
      )}
    </div>
  );
};

export default ComentariosPage;
 
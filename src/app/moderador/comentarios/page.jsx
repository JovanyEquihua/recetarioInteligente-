'use client';
import { useEffect, useState } from 'react';

export default function ComentariosPage() {
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const res = await fetch(`/api/receta/todos`);  // <== AQUÍ cambiaste la ruta
        const data = await res.json();
        setComentarios(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al obtener comentarios:', error);
      }
    };
    fetchComentarios();
  }, []);

  const handleDelete = async (idComentario) => {
    if (confirm('¿Seguro que quieres eliminar este comentario?')) {
      const res = await fetch(`/api/receta/${idComentario}`, { method: 'DELETE' });
      if (res.ok) {
        setComentarios(comentarios.filter((c) => c.id !== idComentario));
      } else {
        alert('Error al eliminar.');
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Comentarios</h2>
      <ul>
        {comentarios.length > 0 ? (
          comentarios.map((comentario) => (
            <li key={comentario.id} className="flex justify-between items-center border-b py-2">
              <span>
                <strong>{comentario.usuario?.nombreUsuario || 'Anónimo'}</strong>: {comentario.comentario}
              </span>
              <button
                onClick={() => handleDelete(comentario.id)}
                className="text-red-500 hover:text-red-700"
              >
                Eliminar
              </button>
            </li>
          ))
        ) : (
          <p>No hay comentarios aún.</p>
        )}
      </ul>
    </div>
  );
}

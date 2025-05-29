'use client';

import { useEffect, useState } from 'react';

export default function RecetasPage({ id }) {
  const [recetas, setRecetas] = useState([]);

  useEffect(() => {
    const fetchRecetas = async () => {
      const res = await fetch(`/api/recetas/todas`);
      const data = await res.json();
      setRecetas(Array.isArray(data) ? data : [data]); // por si solo es una receta
    };
    fetchRecetas();
  }, [id]);

  const handleDelete = async (idReceta) => {
    if (confirm('¿Seguro que quieres eliminar esta receta?')) {
      const res = await fetch(`/api/recetas/${idReceta}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setRecetas(recetas.filter((r) => r.id !== idReceta));
      } else {
        alert('Error al eliminar.');
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Recetas</h2>
      <ul>
        {recetas.map((receta) => (
          <li key={receta.id} className="flex justify-between items-center border-b py-2">
            <span>{receta.titulo}</span>
            <button
              onClick={() => handleDelete(receta.id)}
              className="text-red-500 hover:text-red-700"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
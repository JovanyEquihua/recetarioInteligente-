"use client";
import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";

export default function Busqueda() {
  const [nombre, setNombre] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [resultados, setResultados] = useState([]);

  const buscar = useCallback(
    debounce(async (nombreActual, ingredientesActual) => {
      try {
        const res = await fetch(
          `/api/busqueda?nombre=${nombreActual}&ingredientes=${ingredientesActual}`
        );
        if (!res.ok) throw new Error("Error al buscar recetas");
        const data = await res.json();
        setResultados(data);
      } catch (error) {
        console.error("Error en la búsqueda:", error);
      }
    }, 500),
    []
  ); // 500ms de espera

  useEffect(() => {
    buscar(nombre, ingredientes);
  }, [nombre, ingredientes, buscar]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Buscador de Recetas</h1>
      <input
        type="text"
        placeholder="Nombre de receta"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="border p-2 mr-2"
      />
      <input
        type="text"
        placeholder="Ingredientes separados por coma"
        value={ingredientes}
        onChange={(e) => setIngredientes(e.target.value)}
        className="border p-2 mr-2"
      />

      <div className="mt-6">
        {resultados.map((r) => (
          <div key={r.id} className="mb-4 p-4 border rounded">
            <img
              src={r.imagen}
              alt={r.titulo}
              className="w-24 h-24 object-cover rounded"
            />

            <div>
              <h2 className="text-xl font-semibold">{r.titulo}</h2>
              <p>{r.descripcion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

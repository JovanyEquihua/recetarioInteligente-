"use client";
import { useState } from "react";

export default function Busqueda() {
  const [nombre, setNombre] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [resultados, setResultados] = useState([]);

  const buscar = async () => {
    try {
      const res = await fetch(`/api/busqueda?nombre=${nombre}&ingredientes=${ingredientes}`);
      if (!res.ok) throw new Error("Error al buscar recetas");
      const data = await res.json();
      setResultados(data);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
    }
  };

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
      <button onClick={buscar} className="bg-blue-500 text-white px-4 py-2 rounded">
        Buscar
      </button>

      <div className="mt-6">
        {resultados.map((r) => (
          <div key={r.id} className="mb-4 p-4 border rounded">
            <h2 className="text-xl font-semibold">{r.titulo}</h2>
            <p>{r.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
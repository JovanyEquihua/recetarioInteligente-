"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import debounce from "lodash/debounce";

const BuscadorPage = () => {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);


  const buscar = useCallback(
    debounce(async (queryActual) => {
      if (!queryActual.trim()) {
        setResultados([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/busqueda?query=${encodeURIComponent(queryActual)}`);
        if (!res.ok) throw new Error("Error al buscar recetas");
        const data = await res.json();
        setResultados(data);
      } catch (error) {
        console.error("Error en la búsqueda:", error);
        setResultados([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    buscar(query);
  }, [query, buscar]);

  return (
    <div className="max-w-4xl mx-auto my-10 translate-y-10">
    
      <div className="flex items-center justify-between gap-4 border border-gray-300 bg-white bg-opacity-90 rounded-full px-4 py-2 shadow-md">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca por nombre o ingredientes..."
          className="flex-1 bg-transparent outline-none text-black"
        />
        <Search size={20} className="text-purple-700" />
      </div>

     

      {/* Resultados */}
      {loading ? (
        <p className="text-center mt-6">Buscando...</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {resultados.length > 0 ? (
            resultados.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-md"
              >
                <img
                  src={item.imagen}
                  alt={item.titulo}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div>
                  

                  <h3 className="font-semibold text-gray-600 text-lg">{item.titulo}</h3>
                  <p className="text-sm text-gray-600">{item.descripcion}</p>
                </div>
              </li>
            ))
          ) : query  ? (
            <p className="text-center text-gray-500">No se encontraron resultados.</p>
          ) : null}
        </ul>
      )}
    </div>
  );
};

export default BuscadorPage;

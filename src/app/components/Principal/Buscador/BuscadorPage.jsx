"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import debounce from "lodash/debounce";
import ResultadosPage from "../Resultados/ResultadosPage";

const BuscadorPage = ({ isFiltered }) => {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  const buscar = useCallback(
    debounce(async (queryActual) => {
      const limpio = queryActual.trim();

      if (!limpio) {
        setResultados([]);
        setMostrarResultados(false);
        return;
      }

      const esIngrediente = limpio.includes(",");
      const url = new URL("/api/busqueda", window.location.origin);
      if (esIngrediente) {
        url.searchParams.set("ingredientes", limpio);
      } else {
        url.searchParams.set("nombre", limpio);
      }

      setLoading(true);
      try {
        const res = await fetch(url.toString());
        if (!res.ok) throw new Error("Error al buscar recetas");
        const data = await res.json();
        setResultados(data);
        setMostrarResultados(true); // mostrar resultados tras éxito
      } catch (error) {
        console.error("Error en la búsqueda:", error);
        setResultados([]);
        setMostrarResultados(false);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    buscar(query);
  }, [query, buscar]);

  const cerrarResultados = () => {
    setQuery("");
    setResultados([]);
    setMostrarResultados(false);
  };

  return (
    <div className="relative w-full  ">
      {/* Contenedor principal del buscador */}
      <div className="w-[550px] max-w-lg mx-auto flex items-center gap-2 border border-gray-300 bg-white bg-opacity-90 rounded-full px-3 py-2 shadow-md">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca por nombre o ingredientes (separados por coma)..."
          className="flex-1 min-w-0 bg-transparent outline-none text-black text-sm sm:text-base"
        />
        {mostrarResultados && (
          <button onClick={cerrarResultados}>
            <X size={20} className="text-gray-500 hover:text-red-500" />
          </button>
        )}
        <Search size={20} className="text-purple-700" />
      </div>

      {/* Resultados */}
      {loading ? (
        <p className="text-center mt-4">Buscando...</p>
      ) : (
        mostrarResultados && (
          <div className="absolute mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 z-50">
              {resultados
                .filter((item) => item && item.imagen)
                .map((item) => (
                  <ResultadosPage key={item.id || item._id} receta={item} />
                ))}
            </div>
         
        )
      )}
    </div>
  );
};

export default BuscadorPage;

 

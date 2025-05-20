"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import debounce from "lodash/debounce";
import CajaRecetaPage from "../CajasReceta/CajaRecetaPage";

const BuscadorPage = () => {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);

  const buscar = useCallback(
    debounce(async (queryActual) => {
      const limpio = queryActual.trim();

      if (!limpio) {
        setResultados([]);
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
      <div className=" w-full"> {/* Contenedor principal modificado */}
      <div className=" w-[550px] flex items-center gap-2 border border-gray-300 bg-white bg-opacity-90 rounded-full px-3 py-2 shadow-md">
      <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca por nombre o ingredientes (separados por coma)..."
            className="flex-1 min-w-0 bg-transparent outline-none text-black text-sm sm:text-base"
      />
        <Search size={20} className="text-purple-700" />
      </div>

      {loading ? (
        <p className="text-center mt-6">Buscando...</p>
      ) : (
        <div className=" absolute  mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 z-50 ">
  {resultados.map((item) => (
    <li key={item.id}>
      <CajaRecetaPage
        id={item.id}
        titulo={item.titulo}
        descripcion={
        (item.pasosPreparacion[0]?.paso
          ? item.pasosPreparacion[0].paso + "..."
          : "Sin descripción disponible")
      }
        imagen={item.imagen}
      />
    </li>
  ))}
      </div>

      )}
    </div>
  );
};

export default BuscadorPage;


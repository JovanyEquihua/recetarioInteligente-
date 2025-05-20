"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
const Filtrar = () => {
  const router = useRouter();

  const handleViewRecipe = (id) => {
    router.push(`/usuario/recetas/${id}`);
  };

  const [filters, setFilters] = useState({
    tipoComida: [],
    dificultad: "",
    tiempoPreparacionMin: 10,
    tiempoPreparacionMax: 180,
    preferencias: [],
    ingredientes: "",
  });

  const [resultados, setResultados] = useState([]);

  const handleCuisineClick = (cuisine) => {
    setFilters((prev) => {
      const newCuisines = prev.tipoComida.includes(cuisine)
        ? prev.tipoComida.filter((c) => c !== cuisine)
        : [...prev.tipoComida, cuisine];
      return { ...prev, tipoComida: newCuisines };
    });
  };

  const handleDietClick = (diet) => {
    setFilters((prev) => {
      const newDiets = prev.preferencias.includes(diet)
        ? prev.preferencias.filter((d) => d !== diet)
        : [...prev.preferencias, diet];
      return { ...prev, preferencias: newDiets };
    });
  };

  const handleDifficultyClick = (difficulty) => {
    setFilters((prev) => ({
      ...prev,
      dificultad: prev.dificultad === difficulty ? "" : difficulty,
    }));
  };

  const handleTimeChange = (e, type) => {
    const value = parseInt(e.target.value);
    setFilters((prev) => ({
      ...prev,
      [`tiempoPreparacion${type}`]: value,
    }));
  };

  const handleIngredientsChange = (e) => {
    setFilters((prev) => ({ ...prev, ingredientes: e.target.value }));
  };

  const applyFilters = async () => {
    try {
      const response = await fetch("/api/filtrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipoComida: filters.tipoComida,
          dificultad: filters.dificultad || null,
          tiempoPreparacionMin: filters.tiempoPreparacionMin || null,
          tiempoPreparacionMax: filters.tiempoPreparacionMax || null,
          preferencias: filters.preferencias,
          ingredientes: filters.ingredientes || null,
        }),
      });
      const data = await response.json();
      setResultados(data);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const cuisines = [
    { name: "Francesa", value: "Francesa" },
    { name: "Italiana", value: "Italiana" },
    { name: "India", value: "India" },
    { name: "Japonesa", value: "Japonesa" },
    { name: "Mexicana", value: "Mexicana" },
    { name: "Griega", value: "Greiga" },
  ];

  const diets = [
    { name: "Vegetariana", value: "vegetariana" },
    { name: "Vegana", value: "vegana" },
    { name: "Sin Gluten", value: "sin-gluten" },
    { name: "Sin Lácteos", value: "sin-lacteos" },
  ];

  const difficulties = [
    { name: "Fácil", value: "Facil" },
    { name: "Medio", value: "Medio" },
    { name: "Difícil", value: "Dificil" },
  ];

  return (
    <div className="relative flex  flex-col  ">
      <div className="flex flex-col lg:flex-row  ">
        {/* Panel de Filtros */}
        <div className="rounded-lg shadow-md p-6 w-full lg:w-80">
          <h1 className="text-[#1b0e11] text-2xl font-bold mb-6">
            Filtrar Recetas
          </h1>

          {/* Tipos de cocina */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Tipos de Cocina</h2>
            <div className="flex flex-wrap gap-2">
              {cuisines.map((cuisine) => (
                <button
                  key={cuisine.value}
                  onClick={() => handleCuisineClick(cuisine.value)}
                  className={`px-3 py-1 rounded-full border ${
                    filters.tipoComida.includes(cuisine.value)
                      ? "bg-[#e4d5da] border-[#a61139]"
                      : "border-gray-300"
                  } text-sm`}
                >
                  {cuisine.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tiempo de cocina */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Tiempo de Cocina</h2>
            <div className="mb-2 text-sm text-gray-600">
              {filters.tiempoPreparacionMin} min -{" "}
              {filters.tiempoPreparacionMax} min
            </div>
            <input
              type="range"
              min="10"
              max="180"
              value={filters.tiempoPreparacionMax}
              onChange={(e) => handleTimeChange(e, "Max")}
              className="w-full accent-[#a61139]"
            />
            <input
              type="range"
              min="10"
              max={filters.tiempoPreparacionMax - 10}
              value={filters.tiempoPreparacionMin}
              onChange={(e) => handleTimeChange(e, "Min")}
              className="w-full accent-[#a61139] mt-2"
            />
          </div>

          {/* Dificultad */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Dificultad</h2>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty.value}
                  onClick={() => handleDifficultyClick(difficulty.value)}
                  className={`px-3 py-1 rounded-full border ${
                    filters.dificultad === difficulty.value
                      ? "bg-[#e4d5da] border-[#a61139]"
                      : "border-gray-300"
                  } text-sm`}
                >
                  {difficulty.name}
                </button>
              ))}
            </div>
          </div>

          {/* Preferencias Dietéticas */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">
              Preferencias Dietéticas
            </h2>
            <div className="flex flex-wrap gap-2">
              {diets.map((diet) => (
                <button
                  key={diet.value}
                  onClick={() => handleDietClick(diet.value)}
                  className={`px-3 py-1 rounded-full border ${
                    filters.preferencias.includes(diet.value)
                      ? "bg-[#e4d5da] border-[#a61139]"
                      : "border-gray-300"
                  } text-sm`}
                >
                  {diet.name}
                </button>
              ))}
            </div>
          </div>

          {/* Ingredientes */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Ingredientes</h2>
            <input
              type="text"
              placeholder="Buscar ingredientes"
              value={filters.ingredientes}
              onChange={handleIngredientsChange}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>

          {/* Botón aplicar filtros */}
          <button
            onClick={applyFilters}
            className="w-full bg-[#a61139] hover:bg-[#89102f] text-white py-2 rounded-md font-bold"
          >
            Aplicar Filtros
          </button>
        </div>

        {/* Resultados */}
        {/* <div className="flex-1 w-[550px]">
          <h2 className="text-2xl font-bold mb-6">Resultados</h2>
          {resultados.length > 0 ? (
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {resultados.map((receta) => (
                <div
                  key={receta.id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={receta.imagen || "/placeholder-food.jpg"}
                      alt={receta.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <span className="inline-block bg-[#8B1C62] text-white text-xs font-bold px-2 py-1 rounded-full">
                        {receta.tiempoPreparacion} min
                      </span>
                      <span className="ml-2 inline-block bg-white/90 text-[#8B1C62] text-xs font-bold px-2 py-1 rounded-full">
                        {receta.dificultad}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#8B1C62] transition-colors">
                      {receta.titulo}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {receta.descripcion}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-[#f8f0f5] text-[#8B1C62] px-2 py-1 rounded">
                        {receta.tipoComida?.nombre}
                      </span>
                      <button
                    onClick={() => handleViewRecipe(receta.id)}
                    className="text-[#8B1C62] hover:text-[#A32C7A] font-medium text-sm flex items-center"
                  >
                    Ver receta
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center shadow-md">
              <div className="text-[#8B1C62] mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No se encontraron recetas
              </h3>
              <p className="text-gray-600">
                Prueba ajustando tus filtros de búsqueda
              </p>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default Filtrar;

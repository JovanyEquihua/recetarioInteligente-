"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import ResultadosPage from "../components/Principal/Resultados/ResultadosPage";

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
      </div>
      {/* Resultados */}
      <div className=" ">
      
        {resultados.length > 0 && (
          <div className="absolute  left-1/2 transform translate-x-52 top-[200px]  w-[900px] 
           overflow-hidden">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {resultados.map((receta) => (
                <ResultadosPage key={receta.id} receta={receta} />
              ))}
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default Filtrar;

"use client";
import React, { useState } from "react";

const Filtrar = () => {
  const [filters, setFilters] = useState({
    tipoComida: [],
    dificultad: "",
    tiempoPreparacionMin: 60,
    tiempoPreparacionMax: 90,
    preferencias: [],
    ingredientes: ""
  });

  const handleCuisineClick = (cuisine) => {
    setFilters(prev => {
      const newCuisines = prev.tipoComida.includes(cuisine)
        ? prev.tipoComida.filter(c => c !== cuisine)
        : [...prev.tipoComida, cuisine];
      return { ...prev, tipoComida: newCuisines };
    });
  };

  const handleDietClick = (diet) => {
    setFilters(prev => {
      const newDiets = prev.preferencias.includes(diet)
        ? prev.preferencias.filter(d => d !== diet)
        : [...prev.preferencias, diet];
      return { ...prev, preferencias: newDiets };
    });
  };

  const handleDifficultyClick = (difficulty) => {
    setFilters(prev => ({
      ...prev,
      dificultad: prev.dificultad === difficulty ? "" : difficulty
    }));
  };

  const handleTimeChange = (e, type) => {
    const value = parseInt(e.target.value);
    setFilters(prev => ({
      ...prev,
      [`tiempoPreparacion${type}`]: value
    }));
  };

  const handleIngredientsChange = (e) => {
    setFilters(prev => ({ ...prev, ingredientes: e.target.value }));
  };

  const applyFilters = async () => {
    try {
      const response = await fetch('/api/filtrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipoComida: filters.tipoComida.length > 0 ? filters.tipoComida[0] : null,
          dificultad: filters.dificultad || null,
          tiempoPreparacion: filters.tiempoPreparacionMax || null,
          preferencias: filters.preferencias.length > 0 ? filters.preferencias[0] : null,
          ingredientes: filters.ingredientes || null
        }),
      });

      const data = await response.json();
      console.log("Filtered results:", data);
      // Aquí deberías manejar los resultados, probablemente pasándolos a un estado superior
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const cuisines = [
    { name: "Francesa", value: "francesa" },
    { name: "Italiana", value: "italiana" },
    { name: "India", value: "india" },
    { name: "Japonesa", value: "japonesa" },
    { name: "Mexicana", value: "mexicana" },
    { name: "Griega", value: "griega" }
  ];

  const diets = [
    { name: "Vegetariana", value: "vegetariana" },
    { name: "Vegana", value: "vegana" },
    { name: "Sin Gluten", value: "sin-gluten" },
    { name: "Sin Lácteos", value: "sin-lacteos" }
  ];

  const difficulties = [
    { name: "Fácil", value: "facil" },
    { name: "Medio", value: "medio" },
    { name: "Difícil", value: "dificil" }
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-[#fcf8f9] overflow-x-hidden" style={{ fontFamily: '"Be Vietnam Pro", "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-80">
            <h1 className="text-[#1b0e11] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Cocina</h1>
            
            {/* Sección de tipos de cocina - Tabla como en la imagen */}
            <div className="px-4 pb-4">
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-1">
                      <button 
                        onClick={() => handleCuisineClick("francesa")}
                        className={`w-full text-left p-2 rounded ${filters.tipoComida.includes("francesa") ? 'bg-[#f3e7ea]' : ''}`}
                      >
                        Francesa
                      </button>
                    </td>
                    <td className="py-1">
                      <button 
                        onClick={() => handleCuisineClick("italiana")}
                        className={`w-full text-left p-2 rounded ${filters.tipoComida.includes("italiana") ? 'bg-[#f3e7ea]' : ''}`}
                      >
                        Italiana
                      </button>
                    </td>
                    <td className="py-1">
                      <button 
                        onClick={() => handleCuisineClick("india")}
                        className={`w-full text-left p-2 rounded ${filters.tipoComida.includes("india") ? 'bg-[#f3e7ea]' : ''}`}
                      >
                        India
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1">
                      <button 
                        onClick={() => handleCuisineClick("japonesa")}
                        className={`w-full text-left p-2 rounded ${filters.tipoComida.includes("japonesa") ? 'bg-[#f3e7ea]' : ''}`}
                      >
                        Japonesa
                      </button>
                    </td>
                    <td className="py-1">
                      <button 
                        onClick={() => handleCuisineClick("mexicana")}
                        className={`w-full text-left p-2 rounded ${filters.tipoComida.includes("mexicana") ? 'bg-[#f3e7ea]' : ''}`}
                      >
                        Mexicana
                      </button>
                    </td>
                    <td className="py-1"></td>
                  </tr>
                  <tr>
                    <td className="py-1">
                      <button 
                        onClick={() => handleCuisineClick("griega")}
                        className={`w-full text-left p-2 rounded ${filters.tipoComida.includes("griega") ? 'bg-[#f3e7ea]' : ''}`}
                      >
                        Griega
                      </button>
                    </td>
                    <td className="py-1"></td>
                    <td className="py-1"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Tiempo de cocina */}
            <h2 className="text-[#1b0e11] text-[18px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3">Tiempo de Cocina</h2>
            <div className="px-4 pb-4">
              <div className="flex justify-between mb-2">
                <span>Máx: {filters.tiempoPreparacionMax} minutos</span>
                <span>Min: {filters.tiempoPreparacionMin} minutos</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1">Máximo</label>
                  <input
                    type="range"
                    min="30"
                    max="180"
                    step="10"
                    value={filters.tiempoPreparacionMax}
                    onChange={(e) => handleTimeChange(e, "Max")}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1">Mínimo</label>
                  <input
                    type="range"
                    min="10"
                    max={filters.tiempoPreparacionMax - 10}
                    step="10"
                    value={filters.tiempoPreparacionMin}
                    onChange={(e) => handleTimeChange(e, "Min")}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Dificultad */}
            <h2 className="text-[#1b0e11] text-[18px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3">Dificultad</h2>
            <div className="px-4 pb-4 space-y-2">
              {difficulties.map((difficulty) => (
                <div 
                  key={difficulty.value}
                  onClick={() => handleDifficultyClick(difficulty.value)}
                  className={`p-2 rounded cursor-pointer ${filters.dificultad === difficulty.value ? 'bg-[#f3e7ea] font-bold' : ''}`}
                >
                  {difficulty.name}
                </div>
              ))}
            </div>

            {/* Preferencias Dietéticas */}
            <h2 className="text-[#1b0e11] text-[18px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3">Preferencias Dietéticas</h2>
            <div className="px-4 pb-4">
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-1">
                      <button 
                        onClick={() => handleDietClick("vegetariana")}
                        className={`w-full text-left p-2 rounded ${filters.preferencias.includes("vegetariana") ? 'bg-[#f3e7ea]' : ''}`}
                      >
                        Vegetariana
                      </button>
                    </td>
                    <td className="py-1">
                      <button 
                        onClick={() => handleDietClick("vegana")}
                        className={`w-full text-left p-2 rounded ${filters.preferencias.includes("vegana") ? 'bg-[#f3e7ea]' : ''}`}
                      >
                        Vegana
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1">
                      <button 
                        onClick={() => handleDietClick("sin-gluten")}
                        className={`w-full text-left p-2 rounded ${filters.preferencias.includes("sin-gluten") ? 'bg-[#f3e7ea]' : ''}`}
                      >
                        Sin Gluten
                      </button>
                    </td>
                    <td className="py-1">
                      <button 
                        onClick={() => handleDietClick("sin-lacteos")}
                        className={`w-full text-left p-2 rounded ${filters.preferencias.includes("sin-lacteos") ? 'bg-[#f3e7ea]' : ''}`}
                      >
                        Sin Lácteos
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Ingredientes */}
            <h2 className="text-[#1b0e11] text-[18px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3">Ingredientes</h2>
            <div className="px-4 pb-4">
              <input
                type="text"
                placeholder="Buscar ingredientes"
                value={filters.ingredientes}
                onChange={handleIngredientsChange}
                className="w-full p-2 border border-[#e7d0d6] rounded"
              />
            </div>

            {/* Botón aplicar filtros */}
            <div className="px-4 pb-4">
              <button 
                onClick={applyFilters}
                className="w-full bg-[#a61139] text-white py-2 rounded font-bold"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>

          {/* Sección de resultados - Mantenemos tu código actual */}
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* ... tu código existente para mostrar los resultados ... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filtrar;
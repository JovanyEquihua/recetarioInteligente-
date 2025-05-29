"use client";

import React from "react";
import Link from "next/link";

const RecetaCard = ({ receta, onViewRecipe,usuarioId }) => {
   // Determina la ruta según si el usuario está loggeado
  const ruta = usuarioId
    ? `/usuario/recetas/${receta.id}`
    : `/RecetaCompleta/recetas/${receta.id}`;

  return (
    <div className=" bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group ">
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

           <Link href={ruta}>
            <button
              // onClick={() => onViewRecipe(receta.id)}
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
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 
                  110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecetaCard;

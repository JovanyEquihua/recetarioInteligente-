'use client';
import React from "react";
import Link from "next/link";

const CajaRecetaPage = ({ id, imagen, titulo, descripcion }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl 
    transition duration-300   max-w-xs z-50">
      <img
        src={imagen}
        alt={titulo}
        className="w-full h-44 object-cover rounded-t-2xl p-2"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-[#8B1C62]">{titulo}</h3>
        <p className="mt-2 text-sm text-gray-600 line-clamp-3">{descripcion}</p>

        <Link href={`/usuario/recetas/${id}`}>
           <button
    className="mt-4 w-full text-gray-500 text-sm font-medium py-2 rounded-xl transition-colors relative group focus:outline-none"
  >
    <span className="relative z-10">Ver receta </span>
    <span
      className="absolute left-1/2 -translate-x-1/2 bottom-1 w-0 h-[2px] bg-[#8B1C62] transition-all duration-300 group-hover:w-4/5 group-focus:w-4/5"
    />
  </button>
        </Link>
      </div>
    </div>
  );
};

export default CajaRecetaPage;


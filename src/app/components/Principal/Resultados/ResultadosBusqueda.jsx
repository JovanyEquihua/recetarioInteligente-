import Link from "next/link";
import React from "react";

const ResultadosBusqueda = ({ recetaImagen, receta}) => {
  return (
    <div
      className="bg-white rounded-lg 
   shadow-md hover:shadow-xl transform 
   hover:-translate-y-1 hover:scale-[1.02] transition 
   duration-300 group w-[100px] sm:w-[120px] cursor-pointer"
    >
      <div className="relative h-[100px] sm:h-[140px]  ">
        <img
          src={recetaImagen || "/placeholder-food.jpg"}
          alt={'img'}
          className="w-full h-full object-cover group-hover:scale-105 
          transition-transform duration-500 p-1"
        />
      
      </div>

      <div className="p-2 text-center ">
        <Link href={`/usuario/recetas/${receta.id}`}>
          <button className="text-xs font-bold text-[#8B1C62] group-hover:text-[#A32C7A] hover:underline transition-colors">
            {receta.titulo}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ResultadosBusqueda;

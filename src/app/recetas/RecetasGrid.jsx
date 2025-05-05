"use client";
import Link from "next/link";

export default function RecetasGrid({ recetas }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recetas.map((receta) => (
        <div 
          key={receta.id} 
          className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
        >
          <Link href={`/recetas/${receta.id}`}>
            <div className="relative">
              <img
                src={receta.imagen || "/placeholder-food.jpg"}
                alt={receta.titulo}
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-white font-semibold text-lg">{receta.titulo}</h3>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>⏱ {receta.tiempoPreparacion} min</span>
                <span>🍽️ {receta.porciones} porciones</span>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="bg-[#f0e6ed] text-[#8B1C62] px-2 py-1 rounded-full text-xs">
                  {receta.dificultad}
                </span>
                {receta.tipoComida && (
                  <span className="bg-[#e6f0ed] text-[#6B8E23] px-2 py-1 rounded-full text-xs">
                    {receta.tipoComida}
                  </span>
                )}
              </div>
              
              <p className="text-gray-500 text-xs">
                Publicada: {new Date(receta.fechaCreacion).toLocaleDateString("es-MX")}
              </p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
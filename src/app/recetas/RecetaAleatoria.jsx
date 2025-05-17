"use client";
import { useEffect, useState } from "react";
import { X, Clock, Users, ChevronsRight, Star, Heart } from "lucide-react";

export default function RecetaAleatoria({ onClose }) {
  const [receta, setReceta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchReceta = async () => {
      try {
        const res = await fetch("/api/recetas/aleatoria");
        if (res.ok) {
          const data = await res.json();
          setReceta(data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchReceta();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative p-8 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-gray-200 h-32 w-32 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="grid grid-cols-3 gap-4 w-full mb-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!receta) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
        {/* Header con botón de cerrar */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          {/* <button 
            onClick={() => setIsFavorite(!isFavorite)} 
            className="p-2 bg-white/90 rounded-full shadow-sm"
          >
            <Heart 
              size={20} 
              className={isFavorite ? "fill-[#8B1C62] text-[#8B1C62]" : "text-gray-400"} 
            />
          </button> */}
          <button 
            onClick={onClose} 
            className="p-2 bg-white/90 rounded-full shadow-sm"
          >
            <X className="text-gray-600" size={20} />
          </button>
        </div>

        {/* Contenido principal */}
        <div className="flex flex-col items-center pt-12 pb-8 px-6">
          {/* Badge de recomendación */}
          <div className="absolute top-0 left-0 right-0 bg-[#8B1C62] text-white text-sm font-medium py-2 text-center">
            <Star className="inline mr-2" size={16} />
            ¡Te recomendamos esta deliciosa receta!
          </div>

          {/* Imagen circular con sombra */}
          <div className="relative -mt-6 mb-5">
            <div className="w-36 h-36 rounded-full border-[5px] border-white shadow-xl overflow-hidden">
              <img
                src={receta.imagen || "/placeholder-food.jpg"}
                alt={receta.titulo}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Efecto de brillo */}
            <div className="absolute inset-0 rounded-full pointer-events-none border-[3px] border-white/30"></div>
          </div>

          {/* Título y descripción */}
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-1">{receta.titulo}</h3>
          <p className="text-sm text-gray-500 text-center mb-6 max-w-[80%]">
            {receta.descripcionCorta || "Una receta perfecta para compartir en familia"}
          </p>

          {/* Stats de la receta */}
          <div className="w-full grid grid-cols-3 gap-3 mb-8">
            <div className="text-center p-3 bg-[#faf5f9] rounded-lg">
              <Clock className="mx-auto text-[#8B1C62]" size={22} />
              <p className="text-xs font-medium mt-1">{receta.tiempoPreparacion} min</p>
            </div>
            <div className="text-center p-3 bg-[#faf5f9] rounded-lg">
              <Users className="mx-auto text-[#8B1C62]" size={22} />
              <p className="text-xs font-medium mt-1">{receta.porciones} {receta.porciones === 1 ? "porción" : "porciones"}</p>
            </div>
            <div className="text-center p-3 bg-[#faf5f9] rounded-lg">
              <div className="text-xs font-medium px-3 py-1 bg-[#8B1C62] text-white rounded-full capitalize">
                {receta.dificultad}
              </div>
            </div>
          </div>

          {/* Botón principal */}
          <a 
            href={`/usuario/recetas/${receta.id}`}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#8B1C62] to-[#B82D7A] text-white rounded-xl hover:from-[#6E1450] hover:to-[#8B1C62] transition-all shadow-md hover:shadow-lg"
          >
            <span className="font-medium">Ver receta completa</span>
            <ChevronsRight size={18} className="mt-0.5" />
          </a>

          {/* Nota adicional */}
          <p className="text-xs text-gray-400 mt-4 text-center">
            Descubre los pasos detallados e ingredientes necesarios
          </p>
        </div>
      </div>
    </div>
  );
}
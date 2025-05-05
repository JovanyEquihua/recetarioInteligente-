"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FavoritoButton({ inicial = false, onToggle }) {
  const [esFavorita, setEsFavorita] = useState(inicial);

  const toggleFavorito = () => {
    const nuevoEstado = !esFavorita;
    setEsFavorita(nuevoEstado);
    if (onToggle) onToggle(nuevoEstado);
  };

  return (
    <button
      onClick={toggleFavorito}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
        esFavorita 
          ? 'bg-[#ff6b6b]/10 text-[#ff6b6b] border border-[#ff6b6b]/20' 
          : 'bg-[#8B1C62]/10 text-[#8B1C62] border border-[#8B1C62]/20'
      } hover:shadow-md`}
      aria-label={esFavorita ? "Quitar de favoritos" : "Añadir a favoritos"}
    >
      {/* Contenedor del icono con animación de bookmark */}
      <motion.div 
        className="relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Base del bookmark */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        
        {/* Corazón dentro del bookmark */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{
            scale: esFavorita ? [0.8, 1.1, 1] : 0.8,
            opacity: esFavorita ? 1 : 0
          }}
          transition={{ duration: 0.4 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Texto con animación */}
      <AnimatePresence mode="wait">
        <motion.span
          key={esFavorita ? "favorito" : "no-favorito"}
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 5 }}
          transition={{ duration: 0.2 }}
          className="text-sm font-medium"
        >
          {esFavorita ? "Guardado" : "Guardar"}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
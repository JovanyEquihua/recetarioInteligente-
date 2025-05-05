"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function FavoritoButton({ recetaId, usuarioId, esFavoritoInicial = false }) {
  const [esFavorita, setEsFavorita] = useState(esFavoritoInicial);
  const [cargando, setCargando] = useState(false);

  const toggleFavorito = async () => {
    if (cargando) return;
    setCargando(true);
    console.log("Datos recibidos:", { recetaId, usuarioId });
    try {

      const metodo = esFavorita ? 'DELETE' : 'POST';
      const respuesta = await fetch('/api/receta/favoritos', {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({ recetaId, usuarioId }),
      });

      if (respuesta.ok) {
        setEsFavorita(!esFavorita);
      } else {
        console.error('Error al actualizar favorito');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button 
        onClick={toggleFavorito}
        disabled={cargando}
        className="p-2 rounded-full bg-gradient-to-br from-[#faf5f9] to-[#f3e6f0] shadow-inner"
      >
        <motion.div
          animate={{ 
            rotateY: esFavorita ? 180 : 0,
            color: esFavorita ? "#ff6b6b" : "#8B1C62"
          }}
          transition={{ duration: 0.6 }}
          className="h-8 w-8 flex items-center justify-center"
        >
          {esFavorita ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          )}
        </motion.div>
      </button>
      
      <motion.span
        animate={{ color: esFavorita ? "#ff6b6b" : "#8B1C62" }}
        className="text-xs font-medium"
      >
        {cargando ? 'Guardando...' : esFavorita ? "✓ Guardado" : "Marcar"}
      </motion.span>
    </div>
  );
}
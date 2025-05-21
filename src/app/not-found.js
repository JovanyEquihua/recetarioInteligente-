"use client";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  const router = useRouter();

  const foodItems = [
    { icon: "🍅", name: "tomate" },
    { icon: "🧅", name: "cebolla" },
    { icon: "🍄", name: "champiñón" },
    { icon: "🥕", name: "zanahoria" },
  ];

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-white px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-8 max-w-md relative">
        {/* Plato central con animación */}
        <div className="relative mx-auto w-48 h-48 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-8 border-white shadow-xl flex items-center justify-center animate-spin-slow">
          <span className="text-5xl">🍽️</span>

          {foodItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                x: Math.cos(index * (2 * Math.PI / foodItems.length)) * 80,
                y: Math.sin(index * (2 * Math.PI / foodItems.length)) * 80
              }}
              transition={{
                delay: index * 0.2,
                type: "spring",
                stiffness: 100
              }}
              className="absolute text-3xl hover:scale-125 transition-transform"
            >
              {item.icon}
            </motion.div>
          ))}
        </div>

        {/* Título y descripción */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h1 className="text-3xl font-extrabold text-[#8B1C62]">
            ¡Ups! Plato no encontrado
          </h1>
          <p className="text-gray-600 mt-2">
            La receta que buscas parece haberse esfumado de nuestro menú.
          </p>
        </motion.div>

        {/* Botón de regreso */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center px-6 py-3 bg-[#8B1C62] text-white rounded-full hover:bg-[#6b134f] transition-colors shadow-lg"
          >
            <Home className="mr-2" size={18} />
            Volver al inicio
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import Link from "next/link";

export default function MapaDestacado({ usuarioId }) {

   const ruta = usuarioId
    ? `/usuario/mapa`
    : `/mapa`;
   
  return (
    <div
      className="py-16 px-20   mb-1 bg-[#8B1C62]"

    >
      <div className="flex flex-col  items-center  justify-center text-center space-y-6">
        {/* Título con animación */}
        <motion.h2
          className="text-4xl sm:text-5xl font-bold text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Explora el mundo a través de la cocina
          
        </motion.h2>

        {/* Texto con efecto de escritura (opcional, vacío por ahora) */}
        <motion.p
          className="text-white text-lg sm:text-xl max-w-2xl font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Typewriter
            words={["Conocé las recetas más destacadas de nuestra comunidad"]}
            loop={0}
            cursor
            cursorStyle="|"
            typeSpeed={50}
            deleteSpeed={250}
            delaySpeed={5000}
          />
            
          
        </motion.p>

        {/* Botón a mapaRecetas */}
        <Link href={ruta}>
          <motion.div
            className="bg-[#6B8E23] text-white font-semibold px-10 py-3 
            rounded-xl shadow-lg hover:bg-[#b0eb3ca8] transition cursor-pointer"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Descubrir mapa
          </motion.div>
        </Link>
      </div>
    </div>
  );
}

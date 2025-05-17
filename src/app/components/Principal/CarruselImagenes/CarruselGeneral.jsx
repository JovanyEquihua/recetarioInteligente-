"use client";

import { Fade } from "react-awesome-reveal";
import React from "react";
import CarruselPage from "./Carrusel/CarruselPage";
import BuscadorPage from "../Buscador/BuscadorPage";


const CarruselGeneral = () => {
  

  return (
    <div className="relative w-full max-w-6xl mx-auto mt-10">
      {/* Carrusel */}
      <div className="relative">
        <CarruselPage />
        {/* Overlay con texto y buscador */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white   mt-16
        ">
          <Fade direction="up" delay={800} cascade damping={1e-1} triggerOnce>
            <p className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl font-bold drop-shadow-lg">
              Cocina con Propósito, Disfruta con Sabor
            </p>
            <p className="mt-16 text-lg sm:text-xl max-w-3xl drop-shadow-md">
              Encuentra recetas creativas que aprovechan al máximo tus ingredientes,
              reduciendo el desperdicio y maximizando el placer en cada comida.
            </p>

            {/* Buscador y botón de filtro*/}
            <div className="flex justify-between items-center mt-16 ">
              {/* Buscador */}
              <div className=" w-full max-w-2xl ">
              <BuscadorPage />
              </div>
              
              {/* Botón filtro */}
              <div className=" translate-y-10 ml-32 ">
              <button className=" w-44 h-10 bg-[#8B1C62] text-white rounded-md hover:bg-[#8b1c62d2] transition duration-300
              text-lg">
                Filtrar Recetas
              </button>
              </div>
             
            </div>
          </Fade>
        </div>
      </div>
    </div>
  );
};

export default CarruselGeneral;

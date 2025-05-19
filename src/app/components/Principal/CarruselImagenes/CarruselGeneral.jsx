"use client";

import { Fade } from "react-awesome-reveal";
import React, { useState } from "react";
import CarruselPage from "./Carrusel/CarruselPage";
import BuscadorPage from "../Buscador/BuscadorPage";
import Link from "next/link";
import Filtrar from "@/app/recetas/Filtrar";

const CarruselGeneral = () => {
  const [mostrarFiltrar, setMostrarFiltrar] = useState(false);

  return (
    <div className="relative w-full max-w-6xl mx-auto mt-10">
      {/* Carrusel */}
      <div className="relative">
        <CarruselPage />

        {/* Overlay con texto y buscador */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center
           px-6 text-center text-white mt-16"
        >
          <Fade direction="up" delay={100} cascade damping={1e-1} triggerOnce>
            <p className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl font-bold drop-shadow-lg">
              Cocina con Propósito, Disfruta con Sabor
            </p>
            <p className="mt-16 text-lg sm:text-xl max-w-3xl drop-shadow-md">
              Encuentra recetas creativas que aprovechan al máximo tus
              ingredientes, reduciendo el desperdicio y maximizando el placer en
              cada comida.
            </p>

            {/* Buscador y botón de filtro*/}
            <div className="mt-10 px-6">
              <div className="flex justify-between items-center">
                <div className="w-full max-w-2xl ">
                  <BuscadorPage />
                </div>

                <div className="ml-4">
                  <button
                    className="w-40 h-10 bg-[#8B1C62] text-white rounded-md hover:bg-[#8b1c62d2] transition duration-300 text-lg"
                    onClick={() => setMostrarFiltrar(!mostrarFiltrar)}
                  >
                    Filtrador
                  </button>
                </div>
              </div>
            </div>
            {/* Mostrar Filtrar solo si mostrarFiltrar es true */}
            {mostrarFiltrar && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 top-[550px]">
                <div className="bg-white rounded-xl shadow-2xl p-6 relative">
                  {/* Botón para cerrar */}
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-[#8B1C62] text-2xl font-bold"
                    onClick={() => setMostrarFiltrar(false)}
                    aria-label="Cerrar"
                  >
                    X
                  </button>
                  <Filtrar />
                </div>
              </div>
            )}
          </Fade>
        </div>
      </div>
    </div>
  );
};

export default CarruselGeneral;

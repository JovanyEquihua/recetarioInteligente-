"use client";

import { Fade } from "react-awesome-reveal";
import React, { useState } from "react";
import CarruselPage from "./Carrusel/CarruselPage";
import BuscadorPage from "../Buscador/BuscadorPage";
import Filtrar from "@/app/recetas/Filtrar";

const CarruselGeneral = () => {
  const [mostrarFiltrar, setMostrarFiltrar] = useState(false);

  return (
    <div className="relative w-full max-w-7xl mx-auto mt-10 flex transition-all duration-500">
      {/* Panel de filtrado */}
      {mostrarFiltrar && (
        <div className="relative z-50 bg-white rounded-xl shadow-2xl p-6 min-w-[300px] max-w-[350px] transition-all duration-500">
          <button
            className="text-gray-500 hover:text-[#8B1C62] text-2xl font-bold mb-2 translate-x-72"
            onClick={() => setMostrarFiltrar(false)}
            aria-label="Cerrar"
          >
            X
          </button>
          <Filtrar />
        </div>
      )}

      {/* Carrusel y contenido principal */}
      <div
        className={`transition-all duration-500 ${
          mostrarFiltrar
            ? "w-[calc(100%-350px)] scale-[0.95] translate-x-4"
            : "w-full"
        }`}
      >
        <div className="relative">
          <CarruselPage isFiltered={mostrarFiltrar} />

          {/* Overlay con texto y buscador */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white transition-all duration-500 ${
              mostrarFiltrar ? "py-10  " : "mt-16"
            }`}
          >
            <Fade direction="up" delay={100} cascade damping={1e-1} triggerOnce>
              <div
                className={`${
                  mostrarFiltrar
                    ? "rounded-xl p-4 text-white w-full max-w-md mx-auto flex flex-col items-center justify-center text-center"
                    : "flex flex-col items-center justify-center text-center"
                }`}
              >
                <p
                  className={`font-bold drop-shadow-lg ${
                    mostrarFiltrar
                      ? "text-xl sm:text-2xl mt-5 w-full"
                      : "text-4xl sm:text-4xl md:text-5xl lg:text-5xl w-full"
                  }`}
                >
                  Cocina con Propósito, Disfruta con Sabor
                </p>
                <p
                  className={`drop-shadow-md ${
                    mostrarFiltrar
                      ? "text-sm sm:text-base mt-4 w-[550px]"
                      : "mt-16 text-lg sm:text-xl max-w-3xl w-full"
                  }`}
                >
                  Encuentra recetas creativas que aprovechan al máximo tus
                  ingredientes, reduciendo el desperdicio y maximizando el
                  placer en cada comida.
                </p>
              </div>

              {/* Buscador y botón */}
              <div
                className={`mt-8 px-2 ${
                  mostrarFiltrar ? "max-w-md mx-auto  flex justify-center items-center mt-0 " : ""
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="w-full max-w-2xl">
                    <BuscadorPage isFiltered={mostrarFiltrar} />
                  </div>
                  {!mostrarFiltrar && (
                    <div className="ml-4">
                      <button
                        className="w-40 h-10 bg-[#8B1C62] text-white rounded-md hover:bg-[#8b1c62d2] transition duration-300 text-lg"
                        onClick={() => setMostrarFiltrar(true)}
                      >
                        Filtrar Recetas
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Fade>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarruselGeneral;

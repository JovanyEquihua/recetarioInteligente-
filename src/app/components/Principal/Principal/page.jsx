"use client";
import React, { useState } from "react";
import CarruselImagenes from "../CarruselImagenes/CarruselGeneral";
import DestacadosPage from "../Destacadas/DestacadosPage";

const Index = () => {
  const [mostrarFiltrar, setMostrarFiltrar] = useState(false);
  const [busquedaActiva, setBusquedaActiva] = useState(false);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="">
        <CarruselImagenes
          mostrarFiltrar={mostrarFiltrar}
          setMostrarFiltrar={setMostrarFiltrar}
          busquedaActiva={busquedaActiva}
          setBusquedaActiva={setBusquedaActiva}
        />
      </div>

      {/* Condicional: si no se está filtrando, muestra los destacados */}
      {!mostrarFiltrar && (
        <div
          className={`relative transition-all duration-500   ${
            busquedaActiva
              ? "relative opacity-10 backdrop-blur-sm pointer-events-none  -z-[1] "
              : "opacity-100"
          }`}
        >
          <DestacadosPage />
        </div>
      )}
    </div>
  );
};

export default Index;

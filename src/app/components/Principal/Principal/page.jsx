"use client";
import React, { useState } from "react";
import CarruselImagenes from "../CarruselImagenes/CarruselGeneral";
import DestacadosPage from "../Destacadas/DestacadosPage";

const Index = () => {
  const [mostrarFiltrar, setMostrarFiltrar] = useState(false);

  return (
    <div className="flex flex-col">
      <CarruselImagenes
        mostrarFiltrar={mostrarFiltrar}
        setMostrarFiltrar={setMostrarFiltrar}
      />
      
      {/* Condicional: si no se está filtrando, muestra los destacados */}
      {!mostrarFiltrar && (
        <div className="transition-all duration-500">
          <DestacadosPage />
        </div>
      )}
    </div>
  );
};

export default Index;
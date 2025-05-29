"use client";
import React from "react";
import RecetaCard from "@/app/recetas/RecetaCard";

const ResultadosPage = ({ receta,usuarioId }) => {

  return (
    
    <RecetaCard receta={receta} usuarioId={usuarioId} />
  );
};

export default ResultadosPage;

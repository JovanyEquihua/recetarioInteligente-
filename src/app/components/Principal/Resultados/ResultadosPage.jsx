"use client";
import React from "react";
import RecetaCard from "@/app/recetas/RecetaCard";

const ResultadosPage = ({ receta }) => {
  return (
    
    <RecetaCard receta={receta} />
  );
};

export default ResultadosPage;

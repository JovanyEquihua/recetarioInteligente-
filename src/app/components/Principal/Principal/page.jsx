"use client";
import React from "react";
import CarruselImagenes from "../CarruselImagenes/CarruselGeneral";
import CajaRecetaPage from "../CajasReceta/CajaRecetaPage";
const index = () => {
  return (
    <div>
      <div>
        <CarruselImagenes />
      </div>
      <div className="relative w-full max-w-6xl mx-auto">
        <p className="mt-10  font-semibold text-3xl sm:text-2xl ">
          Recetas Destacadas
        </p>
        <div className="flex gap-10 flex-wrap justify-between mt-10">
          <CajaRecetaPage
            imagen="\images\Principal\P2.jpg"
            titulo="Delicias de Primavera con Verduras Frescas"
            descripcion="Plato vibrante que celebra los sabores de la estación."
          />
          <CajaRecetaPage
            imagen="\images\Principal\P2.jpg"
            titulo="Delicias de Primavera con Verduras Frescas"
            descripcion="Plato vibrante que celebra los sabores de la estación."
          />
          <CajaRecetaPage
            imagen="\images\Principal\P2.jpg"
            titulo="Delicias de Primavera con Verduras Frescas"
            descripcion="Plato vibrante que celebra los sabores de la estación."
          />
        </div>
      </div>
      <div className="relative w-full max-w-6xl mx-auto">
        <p className="mt-10  font-semibold text-3xl sm:text-2xl  ">
          Categorías de Recetas
        </p>
        <div className="flex gap-10 flex-wrap justify-between mt-10">
          <CajaRecetaPage
            imagen="\images\Principal\P2.jpg"
            titulo="Delicias de Primavera con Verduras Frescas"
            descripcion="Plato vibrante que celebra los sabores de la estación."
          />
          <CajaRecetaPage
            imagen="\images\Principal\P2.jpg"
            titulo="Delicias de Primavera con Verduras Frescas"
            descripcion="Plato vibrante que celebra los sabores de la estación."
          />
          <CajaRecetaPage
            imagen="\images\Principal\P2.jpg"
            titulo="Delicias de Primavera con Verduras Frescas"
            descripcion="Plato vibrante que celebra los sabores de la estación."
          />
        </div>
      </div>
      <div className="relative w-full max-w-6xl mx-auto">
        <p className="mt-10  font-semibold text-3xl sm:text-2xl ">
          Platos Populares
        </p>
        <div className="flex gap-10 flex-wrap justify-between mt-10">
          <CajaRecetaPage
            imagen="\images\Principal\P2.jpg"
            titulo="Delicias de Primavera con Verduras Frescas"
            descripcion="Plato vibrante que celebra los sabores de la estación."
          />
          <CajaRecetaPage
            imagen="\images\Principal\P2.jpg"
            titulo="Delicias de Primavera con Verduras Frescas"
            descripcion="Plato vibrante que celebra los sabores de la estación."
          />
          <CajaRecetaPage
            imagen="\images\Principal\P2.jpg"
            titulo="Delicias de Primavera con Verduras Frescas"
            descripcion="Plato vibrante que celebra los sabores de la estación."
          />
        </div>
      </div>
    </div>
  );
};

export default index;

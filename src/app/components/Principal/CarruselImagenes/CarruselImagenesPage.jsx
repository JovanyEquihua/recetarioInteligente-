"use client";

import { Fade } from "react-awesome-reveal";
import React from "react";
import CarruselPage from "./Carrusel/CarruselPage";


const CarruselImagenesPage = () => {
  

  return (
    <div className="relative  px-32  sm:pb-24   ">
      <Fade
        direction={"up"}
        delay={800}
        cascade
        damping={1e-1}
        triggerOnce={true}
      >
        {/*  Contenedor carrusel  */}
        <div className=" flex items-center justify-center ">
     
         <CarruselPage/>
        </div>

        {/* Contenedor del texto */}
        <div className=" absolute inset-0  -translate-y-60 flex flex-col items-center justify-center  space-y-6">
          <p className=" text-4xl font-bold text-center text-[#ffffff] sm:text-4xl md:text-4xl lg:text-4xl drop-shadow-lg ">
            Cocina con propósito, disfutra con sabor
          </p>

          <p className="text-xl text-center text-white sm:text-xl md:text-xl lg:text-xl drop-shadow-lg mr-10 ">
            Encuentra recetas creativas que aprovechan al máximo tus
            ingredintes, reduciendo el desperdicio y maximizando el placer de
            cada comida.
          </p>
        </div>
      </Fade>
    </div>
  );
};

export default CarruselImagenesPage;

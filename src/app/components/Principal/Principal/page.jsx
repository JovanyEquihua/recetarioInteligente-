"use client";
import React from "react";
import CarruselImagenes from "../CarruselImagenes/CarruselGeneral";
import DestacadosPage from "../Destacadas/DestacadosPage";

const index = () => {
  return (
    <div className="flex flex-col">
      <CarruselImagenes />
      <div className="-z-50">
 <DestacadosPage />
      </div>
     
    </div>
  );
};

export default index;

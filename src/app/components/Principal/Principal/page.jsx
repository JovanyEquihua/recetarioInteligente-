"use client";
import React from "react";
import CarruselImagenes from "../CarruselImagenes/CarruselGeneral";
import DestacadosPage from "../Destacadas/DestacadosPage";

const index = () => {
  return (
    <div>
      <div>
        <CarruselImagenes />
      </div>
      <div >
      <DestacadosPage/>
      </div>
    
    </div>
  );
};

export default index;

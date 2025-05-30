"use client";
import React, { useEffect, useState } from "react";
import CarruselImagenes from "../CarruselImagenes/CarruselGeneral";
import DestacadosPage from "../Destacadas/DestacadosPage";
import { useSession } from "next-auth/react";
import MapaDestacado from "../Mapa/MapaDestacado";
import RecetasCard from "../Recetas/RecetasCard";

const Index = () => {
  const { data: session } = useSession();
  const usuarioId = session?.user?.id;

  const [mostrarFiltrar, setMostrarFiltrar] = useState(false);
  const [busquedaActiva, setBusquedaActiva] = useState(false);
  const [recetasTop, setRecetasTop] = useState([]);

  useEffect(() => {
    async function fetchTop() {
      try {
        const res = await fetch("/api/recetas/top");
        const data = await res.json();

        if (Array.isArray(data)) {
          setRecetasTop(data);
        } else {
        }
      } catch (error) {}
    }

    fetchTop();
  }, []);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="">
        <CarruselImagenes
          mostrarFiltrar={mostrarFiltrar}
          setMostrarFiltrar={setMostrarFiltrar}
          busquedaActiva={busquedaActiva}
          setBusquedaActiva={setBusquedaActiva}
          usuarioId={usuarioId}
        />
      </div>

      {/* Condicional: si no se está filtrando, muestra los destacados */}
      {!mostrarFiltrar && (
        <div>
          <div
            className={`relative transition-all duration-500   ${
              busquedaActiva
                ? "relative opacity-10 backdrop-blur-sm pointer-events-none  -z-[1] "
                : "opacity-100"
            }`}
          >
            <DestacadosPage usuarioId={usuarioId} />
          </div>

          <MapaDestacado usuarioId={usuarioId}  />

          <div className="">
            <RecetasCard recetas={recetasTop} usuarioId={usuarioId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;

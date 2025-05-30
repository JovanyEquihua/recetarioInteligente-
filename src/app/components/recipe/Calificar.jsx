"use client";
import { useEffect, useState, useRef } from "react";
import { FaStar } from "react-icons/fa";

function Calificar({ recetaId, usuarioId, editable = false }) {
  const [hovered, setHovered] = useState(0);
  const [userRating, setUserRating] = useState(null);
  const [promedio, setPromedio] = useState(0);


  const obtenerDatos = async () => {
    try {
      const res = await fetch(
        `/api/receta/calificarUsuario?recetaId=${recetaId}&usuarioId=${usuarioId || ""}`
      );
      if (res.ok) {
        const data = await res.json();
        setUserRating(data.calificacionUsuario ?? null);
         if (typeof data.promedio === "number") setPromedio(data.promedio);
      
      }
    } catch (err) {
      console.error("Error al obtener calificación:", err);
    }
  };

  useEffect(() => {
    if (recetaId) {
      obtenerDatos();
    }
  }, [recetaId, usuarioId]);

  const handleClick = async (value) => {
    try {
      const res = await fetch("/api/receta/calificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recetaId,
          calificacion: value,
          usuario: usuarioId,
        }),
      });

      if (res.ok) {
        // Actualiza ambos: promedio y calificación del usuario
        obtenerDatos();
      }
    } catch (err) {
     
    }
  };

const ratingToShow = hovered || userRating;


  return (
    <div className="relative flex flex-col space-y-2 w-44">
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <FaStar
            key={value}
            className={`cursor-pointer w-4 h-4 transition-colors ${
              ratingToShow >= value ? "text-yellow-400" : "text-gray-300"
            }`}
            onMouseEnter={() => {
              if (editable && usuarioId) setHovered(value);
            }}
            onMouseLeave={() => {
              if (editable && usuarioId) setHovered(0);
            }}
            onClick={() => {
              if (editable && usuarioId) handleClick(value);
            }}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600 font-semibold">
         {userRating !== null ? userRating : "Sin calificación"}
        </span>
      </div>
      
    </div>
  );
}

export default Calificar;

"use client";
import { useEffect, useState, useRef } from "react";
import { FaStar } from "react-icons/fa";

const CalificarEstrellas = ({ recetaId, usuarioId, editable = false }) => {
  const [hovered, setHovered] = useState(0);
  const [userRating, setUserRating] = useState(null);
  const [promedio, setPromedio] = useState(0);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const hoverTimeout = useRef(null);

  //  Obtener promedio general + calificación del usuario (si aplica)
  useEffect(() => {
    const fetchCalificacion = async () => {
      if (!recetaId) return;

      try {
        const res = await fetch(
          `/api/receta/calificar?recetaId=${recetaId}&usuarioId=${
            usuarioId || ""
          }`
        );
        if (res.ok) {
          const data = await res.json();
          if (typeof data.promedio === "number") setPromedio(data.promedio);
          if (typeof data.calificacionUsuario === "number")
            setUserRating(data.calificacionUsuario);
        }
      } catch (err) {
        console.error("Error al obtener calificaciones:", err);
      }
    };

    fetchCalificacion();
  }, [recetaId, usuarioId]);

 

  const ratingToShow = hovered || promedio;

  return (
    <div className="relative flex flex-col space-y-2 w-44">
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <FaStar
            key={value}
            className={`cursor-pointer w-6 h-6 transition-colors ${
              ratingToShow >= value ? "text-yellow-400" : "text-gray-300"
            }`}
            onMouseEnter={() => setHovered(value)}
            onMouseLeave={() => setHovered(0)}
          />
        ))}

        <span className="ml-2 text-sm text-gray-600 font-semibold">
          {promedio.toFixed(1)}
        </span>
      </div>

  
    </div>
  );
};

export default CalificarEstrellas;

"use client";
import { useEffect, useState,useRef} from "react";
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
          `/api/receta/calificar?recetaId=${recetaId}&usuarioId=${usuarioId || ""}`
        );
        if (res.ok) {
          const data = await res.json();
          if (typeof data.promedio === "number") setPromedio(data.promedio);
          if (typeof data.calificacionUsuario === "number") setUserRating(data.calificacionUsuario);
        }
      } catch (err) {
        console.error("Error al obtener calificaciones:", err);
      }
    };

    fetchCalificacion();
  }, [recetaId, usuarioId]);

  // ⬆ Guardar calificación del usuario
  const handleClick = async (value) => {
    if (!editable || !usuarioId) return;

    try {
      const res = await fetch("/api/receta/calificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recetaId, calificacion: value, usuario: usuarioId }),
      });

      if (res.ok) {
        setUserRating(value);
        // Refrescar promedio después de calificar
        const updated = await fetch(
          `/api/receta/calificacion?recetaId=${recetaId}&usuarioId=${usuarioId}`
        );
        const updatedData = await updated.json();
        setPromedio(updatedData.promedio);
      }
    } catch (err) {
      console.error("Error al calificar:", err);
    }
  };


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
            onMouseEnter={() => {
              if (!usuarioId) setTooltipVisible(true);
              if (editable && usuarioId) setHovered(value);
            }}
            onMouseLeave={() => {
              setTooltipVisible(false);
              if (editable && usuarioId) setHovered(0);
              if (!usuarioId) {
                // Espera 600ms antes de ocultar el tooltip
                hoverTimeout.current = setTimeout(() => setTooltipVisible(false), 1000);
              }
            }}
            onClick={() => {
              if (editable && usuarioId) handleClick(value);
            }}
          />
        ))}

        <span className="ml-2 text-sm text-gray-600 font-semibold">
          {promedio.toFixed(1)}
        </span>
      </div>

      {/* Tooltip si no estás logueado */}
      {!usuarioId && tooltipVisible && (
        <div className="absolute w-52 -top-6 left-1/2 -translate-x-1/2 z-20 bg-[#b6d37d] text-sm text-white shadow-md px-2 py-1.5 rounded-md border border-gray-200">
          Inicia sesión para calificar esta receta
        </div>
      )}
    </div>
  );
};

export default CalificarEstrellas;

"use client";

import React from "react";
import Lottie from "react-lottie";

function CookingLoader() {
  const defaultOptions = {
    loop: true, // Repetir la animación
    autoplay: true, // Iniciar automáticamente
    animationData: require("../../../../public/animacion.json"), // Cambia la ruta
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice", // Ajuste de responsividad
    },
  };

  return (
    <div style={{ width: "200px", margin: "0 auto" }}>
      <Lottie options={defaultOptions} />
      <p style={{ textAlign: "center" }}>¡Cocinando algo delicioso! 🍳</p>
    </div>
  );
}

export default CookingLoader;
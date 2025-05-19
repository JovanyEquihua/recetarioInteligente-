"use client";

import React from "react";
import Lottie from "react-lottie-player";
import animationData from "../../../../public/animacion.json"; // Cambia la ruta según tu archivo

function CookingLoader() {
  return (
    <div style={{ width: "200px", margin: "0 auto" }}>
      <Lottie
        loop
        animationData={animationData}
        play
        style={{ height: "200px", width: "200px" }}
      />
      <p style={{ textAlign: "center" }}>¡Cocinando algo delicioso! 🍳</p>
    </div>
  );
}

export default CookingLoader;
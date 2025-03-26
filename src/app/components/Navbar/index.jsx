"use client";
import Navbar from "./Navbar";
import React, { useEffect } from "react";

const Navbarin = () => {
  useEffect(() => {
    // La función debounce recibe nuestra función como parámetro
    const debounce = (fn) => {
      // Esto mantiene la referencia de requestAnimationFrame, para poder cancelarla si es necesario
      let frame;
      // La función debounce devuelve una nueva función que puede recibir un número variable de argumentos
      return (...params) => {
        // Si la variable frame ha sido definida, la limpiamos ahora y la programamos para el siguiente frame
        if (frame) {
          cancelAnimationFrame(frame);
        }
        // Programamos nuestra función para el siguiente frame
        frame = requestAnimationFrame(() => {
          // Llamamos a nuestra función y pasamos los parámetros recibidos
          fn(...params);
        });
      };
    };

    // Lee la posición del scroll y la almacena en el atributo data
    // para que podamos usarla en nuestras hojas de estilo
    const storeScroll = () => {
      document.documentElement.dataset.scroll = window.scrollY.toString();
    };

    // Escucha nuevos eventos de scroll, aquí usamos debounce en nuestra función `storeScroll`
    document.addEventListener("scroll", debounce(storeScroll), { passive: true });

    // Actualiza la posición del scroll por primera vez
    storeScroll();
  }, []);

  return (
    <>
      <Navbar />
    </>
  );
};

export default Navbarin;
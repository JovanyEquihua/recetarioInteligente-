"use client";
import Navbar from "./Navbar";
import React, { useEffect, useState } from "react";

const Navbarin = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Marca que estamos en el cliente
    
    if (typeof window === 'undefined') return; // Salir si estamos en SSR

    const debounce = (fn) => {
      let frame;
      return (...params) => {
        if (frame) {
          cancelAnimationFrame(frame);
        }
        frame = requestAnimationFrame(() => {
          fn(...params);
        });
      };
    };

    const storeScroll = () => {
      document.documentElement.dataset.scroll = window.scrollY.toString();
    };

    window.addEventListener("scroll", debounce(storeScroll), { passive: true });
    storeScroll();

    return () => {
      window.removeEventListener("scroll", debounce(storeScroll));
    };
  }, []);

  if (!isClient) {
    // Renderizar una versión básica durante SSR
    return <Navbar />;
  }

  return (
    <>
      <Navbar />
    </>
  );
};

export default Navbarin;
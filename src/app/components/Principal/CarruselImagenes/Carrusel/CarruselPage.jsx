'use client'
import React, { useState, useEffect } from "react";

function CarruselPage({ isFiltered }) {
  const images = [
    "images/Principal/P1.jpg",
    "images/Principal/P2.jpg",
    "images/Principal/P3.jpg",
    "images/Principal/P4.jpg",
    "images/Principal/P5.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div
      className={`relative mx-auto w-full max-w-6xl rounded-xl shadow-2xl bg-black/90
        ${isFiltered ? "h-[250px]" : "h-[450px]"} transition-all duration-500`}
    >
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Imagen ${index + 1}`}
          className={`absolute w-full h-full rounded-xl object-cover transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-50" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}

export default CarruselPage;


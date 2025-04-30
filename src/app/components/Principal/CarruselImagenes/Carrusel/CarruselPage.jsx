'use client'
import React from 'react'
import { useState, useEffect } from "react";

function CarruselPage() {
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
        }, 4000); // Cambia de imagen cada 4 segundos
    
        return () => clearInterval(interval);
      }, [images.length]);
  return (
    <div className="relative mx-auto w-full max-w-6xl h-[500px] bg-black/90 rounded-xl shadow-2xl">
     
      {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Imagen ${index + 1}`}
              className={`absolute  w-full h-full rounded-xl  
                   object-cover transition-opacity duration-1000 ease-in-out ${
                     index === currentIndex ? "opacity-50" : "opacity-0"
                   }`}
            />
          ))}
     
       
    </div>
  )
}

export default CarruselPage

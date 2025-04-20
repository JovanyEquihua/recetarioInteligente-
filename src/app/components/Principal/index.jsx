"use client";
import Image from "next/image";
import { Fade } from "react-awesome-reveal";
import Link from "next/link";
import React from "react";
import { useState, useEffect } from "react";

const index = () => {
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
    <div id="home-section" className=" relative h-[600px] overflow-hidden ">
      <div className="  px-32 py-10 sm:pb-24   ">
        <Fade
          direction={"up"}
          delay={800}
          cascade
          damping={1e-1}
          triggerOnce={true}
        >
          <div>
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Imagen ${index + 1}`}
                className={`absolute top-0 left-0 rounded-xl
                   object-cover transition-opacity duration-1000 ease-in-out ${
                     index === currentIndex ? "opacity-85" : "opacity-0"
                   }`}
              />
            ))}
          </div>
          {/* Contenedor del texto */}
          <div className=" flex items-center justify-center z-10 py-40  ">
            <p className="text-4xl font-bold text-center text-white sm:text-4xl md:text-4xl lg:text-4xl ">
              Cocina con propósito, disfutra con sabor
            </p>
          </div>
        </Fade>
      </div>
    </div>
  );
};

export default index;

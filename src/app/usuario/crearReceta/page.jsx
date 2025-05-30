"use client";
import CrearReceta from '../../recetas/CrearReceta'
import React from 'react'

const page = () => {
  return (
     <main
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/fondo-lista6.png')", // Cambia la ruta según tu imagen
      }}
    >
    <CrearReceta />
  </main>
  )
}

export default page
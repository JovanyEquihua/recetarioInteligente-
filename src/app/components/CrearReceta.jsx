"use client";

import React, { useState } from "react";

export default function CrearReceta() {
 
  const [formData, setFormData] = useState({
    imagen: null,
  });
  const [mensaje, setMensaje] = useState("");
  const [imageUrl, setImageUrl] = useState(""); 

  const handleFileChange = (e) => {
    setFormData({ ...formData, imagen: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("imagen", formData.imagen);
    formDataToSend.append("imagen", formData.imagen);

    // Verifica el contenido de formDataToSend
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    try {
      const res = await fetch("/api/crear-receta", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje(`Imagen subida con éxito: ${data.url}`);
        setImageUrl(data.url);
      } else {
        setMensaje(data.error || "Error al subir la imagen");
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setMensaje("Error al enviar los datos al servidor");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Subir Imagen</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          name="imagen"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Subir Imagen
        </button>
      </form>
      {mensaje && <p className="mt-4 text-green-500">{mensaje}</p>}
      <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-2">Imagen de Cloudinary</h2>
      <img src={imageUrl} alt="Imagen de Cloudinary" className="w-64 h-64 object-cover rounded-lg shadow-lg" />
    </div>
    </div>
  );
}
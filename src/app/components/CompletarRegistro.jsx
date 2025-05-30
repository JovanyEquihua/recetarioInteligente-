"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { z } from "zod";

const completarPerfilSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellidoP: z.string().min(1, "El apellido paterno es obligatorio"),
  apellidoM: z.string().min(1, "El apellido materno es obligatorio"),
  nombreUsuario: z.string().min(1, "El nombre de usuario es obligatorio"),
  rol: z.enum(["USUARIO", "ADMIN", "MODERATOR"], "Rol inválido"),
});

export default function CompletarPerfil() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoP: "",
    apellidoM: "",
    nombreUsuario: "",
    rol: "USUARIO",
  });
  const [message, setMessage] = useState("");
  const [nombreUsuarioDisponible, setNombreUsuarioDisponible] = useState(true);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const checkNombreUsuario = async (nombreUsuario) => {
    if (nombreUsuario.trim().length === 0) return;

    try {
      const res = await fetch(`/api/verificar-usuario?nombreUsuario=${encodeURIComponent(nombreUsuario)}`);
      const data = await res.json();
      setNombreUsuarioDisponible(data.disponible);
    } catch (error) {
      console.error("Error al verificar nombre de usuario", error);
      setNombreUsuarioDisponible(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "nombreUsuario") {
      checkNombreUsuario(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombreUsuarioDisponible) {
      setMessage("Ese nombre de usuario ya está en uso.");
      return;
    }

    const parseResult = completarPerfilSchema.safeParse(formData);
    if (!parseResult.success) {
      setMessage(parseResult.error.errors[0].message);
      return;
    }

    const res = await fetch("/api/completar-perfil", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setMessage(data.message || data.error);

    if (data.message?.includes("Perfil actualizado")) {
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    }
  };

  const handleClose = () => setIsOpen(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-transform transform hover:rotate-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-bold text-center text-black mb-6">Completa tu perfil</h2>

        <div className="flex flex-col items-center">
          <Image src="/images/Logo/logo.png" alt="logo" width={200} height={200} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none"
            />
            <input
              type="text"
              name="apellidoP"
              placeholder="Apellido Paterno"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none"
            />
          </div>
          <input
            type="text"
            name="apellidoM"
            placeholder="Apellido Materno"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none"
          />
          <input
            type="text"
            name="nombreUsuario"
            placeholder="Nombre de usuario"
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:outline-none ${
              nombreUsuarioDisponible ? "border-gray-300 focus:ring-[#6B8E23]" : "border-red-500 focus:ring-red-500"
            }`}
          />
          {!nombreUsuarioDisponible && (
            <p className="text-sm text-red-600 font-medium -mt-2">Ese nombre de usuario ya está en uso.</p>
          )}

          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-[#8B1C62] rounded-lg hover:bg-[#A44572] transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            Guardar
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm font-semibold text-red-600">{message}</p>
        )}
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { z } from "zod";

// Esquema de validación con Zod
const registroSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellidoP: z.string().min(1, "El apellido paterno es obligatorio"),
  apellidoM: z.string().min(1, "El apellido materno es obligatorio"),
  email: z.string().email("El correo debe ser válido"),
  contrase_a: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
    .regex(/\d/, "Debe contener al menos un número")
    .regex(/[@$!%*?&]/, "Debe incluir un carácter especial"),
  nombreUsuario: z.string().min(1, "El nombre de usuario es obligatorio"),
  rol: z.enum(["USUARIO", "ADMIN", "MODERATOR"], "Rol inválido"),
});

export default function Registrar() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoP: "",
    apellidoM: "",
    email: "",
    contrase_a: "",
    nombreUsuario: "",
    rol: "USUARIO",
  });
  const [message, setMessage] = useState("");

  // Abrir el pop-up al cargar la página
  useEffect(() => {
    setIsOpen(true);
  }, []);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar los datos con Zod
    const parseResult = registroSchema.safeParse(formData);
    if (!parseResult.success) {
      setMessage(parseResult.error.errors[0].message);
      return;
    }

    // Enviar los datos al servidor
    const res = await fetch("/api/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setMessage(data.message || data.error);

    // Redirigir si el registro fue exitoso
    if (data.message && data.message.includes("Usuario registrado")) {
      setTimeout(() => {
        window.location.href = "/verificar"; // Redirigir a la página de verificación
      }, 5000);
    }
  };

  // Cerrar el pop-up
  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-3xl font-bold text-center text-black mb-6">
          Registro
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            type="email"
            name="email"
            placeholder="Correo electrónico"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none"
          />
          <input
            type="password"
            name="contrase_a"
            placeholder="Contraseña"
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
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none"
          />

          <select
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none cursor-pointer"
          >
            <option value="USUARIO">Usuario</option>
            <option value="ADMIN">Administrador</option>
            <option value="MODERATOR">Moderador</option>
          </select>

          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-[#8B1C62] rounded-lg hover:bg-[#A44572] transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            Registrarse
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm font-semibold text-red-600">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
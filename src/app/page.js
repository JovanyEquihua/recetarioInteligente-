"use client";
import { useState } from "react";

export default function Home() {
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const res = await fetch("/api/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h2 className="text-2xl font-bold mb-4">Registro</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="apellidoP"
          placeholder="Apellido Paterno"
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="apellidoM"
          placeholder="Apellido Materno"
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          type="password"
          name="contrase_a"
          placeholder="Contraseña"
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="nombreUsuario"
          placeholder="Nickname"
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        {/* Campo de selección para el rol */}
        <select
          name="rol"
          value={formData.rol}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        >
          <option value="USUARIO">Usuario</option>
          <option value="ADMIN">Administrador</option>
          <option value="MODERATOR">Moderador</option>
        </select>
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Registrarse
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
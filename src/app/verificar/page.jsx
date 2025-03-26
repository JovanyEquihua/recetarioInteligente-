"use client";
import { useState } from "react";

export default function VerificarCuenta() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter(); // Inicializar useRouter
  const handleVerify = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/verificar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token }),
    });

    const data = await res.json();
    setMessage(data.message || data.error);
        // Redirigir a la página principal si la verificación es exitosa
        if (res.ok) {
          setTimeout(() => {
            router.push("/"); // Redirigir a la página principal
          }, 2000); // Esperar 2 segundos antes de redirigir
        }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: "url('/images/fondo.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-black mb-6">
          Verificar Cuenta
        </h2>
        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="email"
            placeholder="Tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none"
          />
          <input
            type="text"
            placeholder="Código de verificación"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none"
          />
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-[#8B1C62] rounded-lg hover:bg-[#A44572] transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            Verificar
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

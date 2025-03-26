"use client";
import { useState } from "react";
import VerificarCodigo from "./VerificarCodigo"; // Importar el formulario

export default function RecuperarContraseña() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [codigoEnviado, setCodigoEnviado] = useState(false); // Estado para mostrar VerificarCodigo



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/password/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const text = await res.text(); // Capturar error como texto si no es JSON
        throw new Error(text);
      }

      const data = await res.json();
      setMensaje(data.message);
      setCodigoEnviado(true);
    } catch (error) {
      console.error("Error en la recuperación:", error);
      setMensaje("Error al procesar la solicitud. Verifica el correo e intenta de nuevo.");
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: "url('/images/fondo.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        {!codigoEnviado ? (
          <>
            <h2 className="text-3xl font-bold text-center text-black mb-6">Recuperar contraseña</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:outline-none"
                placeholder="Ingresa tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full py-2 font-semibold text-white bg-[#8B1C62] rounded-lg hover:bg-[#A44572] transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                Enviar código de verificación
              </button>
            </form>
            {mensaje && <p className="mt-4 text-center text-sm font-semibold text-red-600">{mensaje}</p>}
          </>
        ) : (
          <VerificarCodigo email={email} />
        )}
      </div>
    </div>
  );
}

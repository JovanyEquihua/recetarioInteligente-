'use client';
import { useState } from "react";
import VerificarCodigo from "./VerificarCodigo"; // Importar el formulario

export default function RecuperarContraseña() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [codigoEnviado, setCodigoEnviado] = useState(false); // Estado para mostrar VerificarCodigo

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/password/reset-password",  {
       
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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      {!codigoEnviado ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Recuperar contraseña</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              className="w-full p-2 border rounded"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full mt-3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Enviar código de verificación
            </button>
          </form>
          {mensaje && <p className="mt-3 text-sm">{mensaje}</p>}
        </>
      ) : (
        <VerificarCodigo email={email} />
      )}
    </div>
  );
}

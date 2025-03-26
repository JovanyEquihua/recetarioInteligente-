import { useState } from "react";
import Link from "next/link";

export default function VerificarCodigo() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  
  const [error, setError] = useState("");

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarContrasena = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
    return regex.test(password);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    
    console.log("Token enviado:", token);
    console.log("Email enviado:", email);

    if (!validarEmail(email)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    if (!validarContrasena(newPassword)) {
      setError("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un carácter especial.");
      return;
    }

    
    try {
    const res = await fetch("/api/password/verify-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, newPassword }),
    });
   

    if (!res.ok) {
      const text = await res.text(); // Capturar error como texto si no es JSON
      throw new Error(text);
    } 

   const data = await res.json();
      setMensaje(data.message);
    } catch (error) {
      console.error("Error en la verificación:", error);
      setMensaje("Error al procesar la solicitud. Verifica el código e intenta de nuevooo.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Verificar código</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="w-full p-2 border rounded mb-2"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          className="w-full p-2 border rounded mb-2"
          placeholder="Código recibido"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full p-2 border rounded mb-2"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
                  {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}
                  {mensaje && <p className="text-green-600 text-sm font-semibold">{mensaje}</p>}
         
        <button
          type="submit"
          className="w-full mt-3 bg-[#8B1C62] text-white p-2 rounded-lg hover:bg-green-600"
        >
          Cambiar contraseña
        </button>
       
      </form>
    
    </div>
  );
}

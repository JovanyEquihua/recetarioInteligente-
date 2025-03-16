"use client"
import React, { useState } from "react"
import { signIn } from "next-auth/react"; // Importar la función signIn de NextAuth.js

const LoginJovas = () => {
  const [email, setEmail] = useState("")
  const [contraseña, setCon] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    const result = await signIn("credentials", {
      redirect: false,
      email,
      contraseña,
    });

    if (result.error) {
      setError(result.error);
    } else {
      console.log("Login exitoso", result);
      // Redirigir a la página principal o a la página deseada
      window.location.href = "/hola";
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Iniciar Sesión Jovas
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
            
              type="email"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="correo@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="••••••••"
              required
              value={contraseña}
              onChange={(e) => setCon(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Iniciar sesión
          </button>

          {/* Botón para Google */}
      <button onClick={() => signIn("google")}>Iniciar sesión con Google</button>
        </form>
        <p className="text-sm text-center text-gray-600">
          ¿No tienes cuenta?{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  )
}

export default LoginJovas
"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [email, setEmail] = useState("");
  const [contraseña, setCon] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false,
      email,
      contraseña,
    });

    if (result.error === "NO_EXISTE") {
      router.push("/registrarse");
    } else if (result.error) {
      setError(result.error);
    } else {
      window.location.href = "/hola";
    }
  };

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/hola" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800">Iniciar Sesión</h2>

        {error && (
          <p className="text-red-500 text-center">
            {error === "Demasiados intentos de inicio de sesión. Intenta más tarde."
              ? "Has excedido el número de intentos permitidos. Por favor, espera antes de intentar nuevamente."
              : "Usuario y/o contraseña no válidos."}
          </p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
            <input
              type="email"
              className="w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="correo@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="••••••••"
              required
              value={contraseña}
              onChange={(e) => setCon(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          >
            Iniciar sesión
          </button>
        </form>

        <div className="space-y-4">
          <button
            className="w-full flex items-center justify-center px-4 py-2 font-semibold bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition duration-300"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="mr-2 text-xl" /> Iniciar sesión con Google
          </button>
        </div>

        <div className="text-center">
          Recuperar contra
          {/* <RecuperarContra /> */}
        </div>

        <p className="text-sm text-center text-gray-600">
          ¿No tienes cuenta?{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
}

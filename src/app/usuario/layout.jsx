"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiLogOut, FiUser, FiSettings, FiHome, FiMenu } from "react-icons/fi";

export default function UsuarioLayout({ children }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar moderno */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo y título */}
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => router.push("/usuario")}
            >
                <Image src={"/images/Logo/logo.png"} alt="logo" width={50} height={50} className="rounded-full" />
             
              <h1 className="text-xl font-bold">ChefPick</h1>
            </div>

            {/* Menú desktop */}
            <div className="hidden md:flex items-center space-x-6">
              {session?.user && (
                <>
                  <nav className="flex space-x-4">
                    <button 
                      className="px-3 py-2 hover:bg-indigo-500 rounded-lg transition"
                      onClick={() => router.push("/usuario/perfil")}
                    >
                      Perfil
                    </button>
                    <button 
                      className="px-3 py-2 hover:bg-indigo-500 rounded-lg transition"
                      onClick={() => router.push("/usuario/configuracion")}
                    >
                      Configuración
                    </button>
                  </nav>

                  {/* Avatar y menú desplegable */}
                  <div className="relative">
                    <button 
                      className="flex items-center space-x-2 focus:outline-none"
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                      {session.user.image ? (
                        <img 
                          src={session.user.image} 
                          alt="Foto de perfil"
                          className="w-10 h-10 rounded-full object-cover border-2 border-white"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center">
                          <FiUser className="text-white text-xl" />
                        </div>
                      )}
                      <span className="font-medium">{session.user.nombre || session.user.email}</span>
                    </button>

                    {/* Menú desplegable */}
                    {isMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                        <button
                          onClick={() => router.push("/usuario/perfil")}
                          className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                        >
                          <FiUser className="mr-2" /> Mi Perfil
                        </button>
                        <button
                          onClick={() => router.push("/usuario/configuracion")}
                          className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                        >
                          <FiSettings className="mr-2" /> Configuración
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left border-t border-gray-200"
                        >
                          <FiLogOut className="mr-2" /> Cerrar sesión
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Menú móvil */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 focus:outline-none"
              >
                <FiMenu className="text-2xl" />
              </button>
            </div>
          </div>

          {/* Menú móvil desplegable */}
          {isMenuOpen && (
            <div className="md:hidden bg-indigo-700 mt-2 rounded-lg p-4">
              <div className="flex flex-col space-y-3">
                {session?.user && (
                  <>
                    <button 
                      className="flex items-center space-x-2 px-3 py-2 hover:bg-indigo-600 rounded-lg"
                      onClick={() => router.push("/usuario/perfil")}
                    >
                      <FiUser /> <span>Perfil</span>
                    </button>
                    <button 
                      className="flex items-center space-x-2 px-3 py-2 hover:bg-indigo-600 rounded-lg"
                      onClick={() => router.push("/usuario/configuracion")}
                    >
                      <FiSettings /> <span>Configuración</span>
                    </button>
                    <div className="border-t border-indigo-500 pt-2">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-indigo-600 rounded-lg w-full"
                      >
                        <FiLogOut /> <span>Cerrar sesión</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-2 px-3 py-2">
                      {session.user.image ? (
                        <img 
                          src={session.user.image} 
                          alt="Foto de perfil"
                          className="w-8 h-8 rounded-full object-cover border border-white"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-indigo-400 flex items-center justify-center">
                          <FiUser className="text-white" />
                        </div>
                      )}
                      <span>{session.user.nombre || session.user.email}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
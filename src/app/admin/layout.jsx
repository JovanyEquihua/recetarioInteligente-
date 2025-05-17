"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiLogOut, FiUser, FiSettings, FiHome, FiMenu, FiUsers, FiBarChart2, FiShield } from "react-icons/fi";

export default function AdminLayout({ children }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar premium para admin */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-xl">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo y título */}
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => router.push("/admin")}
            >
              <Image 
                src="/images/Logo/logo.png" 
                alt="ChefPick Admin" 
                width={45} 
                height={45} 
                className="rounded-full border-2 border-amber-400"
              />
              <div>
                <h1 className="text-xl font-bold">ChefPick</h1>
                <p className="text-xs text-amber-300 font-mono">Admin Panel</p>
              </div>
            </div>

            {/* Menú desktop */}
            <div className="hidden md:flex items-center space-x-6">
              {session?.user && (
                <>
                  <nav className="flex space-x-2">
                    <button 
                      className="px-3 py-2 hover:bg-gray-700 rounded-lg transition flex items-center space-x-1"
                      onClick={() => router.push("/admin/dashboard")}
                    >
                      <FiBarChart2 />
                      <span>Dashboard</span>
                    </button>
                    <button 
                      className="px-3 py-2 hover:bg-gray-700 rounded-lg transition flex items-center space-x-1"
                      onClick={() => router.push("/admin/usuarios")}
                    >
                      <FiUsers />
                      <span>Usuarios</span>
                    </button>
                    <button 
                      className="px-3 py-2 hover:bg-gray-700 rounded-lg transition flex items-center space-x-1"
                      onClick={() => router.push("/admin/config")}
                    >
                      <FiShield />
                      <span>Seguridad</span>
                    </button>
                  </nav>

                  {/* Avatar y menú desplegable */}
                  <div className="relative">
                    <button 
                      className="flex items-center space-x-2 focus:outline-none group"
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                      {session.user.image ? (
                        <div className="relative">
                          <img 
                            src={session.user.image} 
                            alt="Admin"
                            className="w-10 h-10 rounded-full object-cover border-2 border-amber-400"
                          />
                          <span className="absolute -bottom-1 -right-1 bg-amber-500 text-xs px-1 py-0.5 rounded-full">
                            <FiShield className="text-white" />
                          </span>
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center border-2 border-amber-400">
                          <FiUser className="text-white text-xl" />
                        </div>
                      )}
                      <div className="text-left">
                        <p className="font-medium">{session.user.nombre || session.user.email}</p>
                        <p className="text-xs text-amber-300">Administrador</p>
                      </div>
                    </button>

                    {/* Menú desplegable */}
                    {isMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl py-1 z-50 border border-gray-200">
                        <div className="px-4 py-2 border-b border-gray-200">
                          <p className="font-medium text-gray-900">Sesión activa</p>
                          <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                        </div>
                        <button
                          onClick={() => router.push("/admin/perfil")}
                          className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                        >
                          <FiUser className="mr-2 text-gray-600" /> Mi Perfil
                        </button>
                        <button
                          onClick={() => router.push("/admin/configuracion")}
                          className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                        >
                          <FiSettings className="mr-2 text-gray-600" /> Configuración
                        </button>
                        <div className="border-t border-gray-200">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                          >
                            <FiLogOut className="mr-2" /> Cerrar sesión
                          </button>
                        </div>
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
                className="p-2 focus:outline-none hover:bg-gray-700 rounded"
              >
                <FiMenu className="text-2xl" />
              </button>
            </div>
          </div>

          {/* Menú móvil desplegable */}
          {isMenuOpen && (
            <div className="md:hidden bg-gray-800 mt-3 rounded-lg p-4 shadow-lg">
              <div className="flex flex-col space-y-3">
                {session?.user && (
                  <>
                    <div className="flex items-center space-x-3 pb-2 border-b border-gray-700">
                      {session.user.image ? (
                        <img 
                          src={session.user.image} 
                          alt="Admin"
                          className="w-10 h-10 rounded-full object-cover border border-amber-400"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center border border-amber-400">
                          <FiUser className="text-white" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{session.user.nombre || session.user.email}</p>
                        <p className="text-xs text-amber-300">Administrador</p>
                      </div>
                    </div>
                    
                    <button 
                      className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-700 rounded-lg"
                      onClick={() => router.push("/admin/dashboard")}
                    >
                      <FiBarChart2 /> <span>Dashboard</span>
                    </button>
                    <button 
                      className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-700 rounded-lg"
                      onClick={() => router.push("/admin/usuarios")}
                    >
                      <FiUsers /> <span>Usuarios</span>
                    </button>
                    <button 
                      className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-700 rounded-lg"
                      onClick={() => router.push("/admin/config")}
                    >
                      <FiShield /> <span>Seguridad</span>
                    </button>
                    <button 
                      className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-700 rounded-lg"
                      onClick={() => router.push("/admin/perfil")}
                    >
                      <FiUser /> <span>Perfil</span>
                    </button>
                    
                    <div className="border-t border-gray-700 pt-2">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 px-3 py-2 text-amber-300 hover:bg-gray-700 rounded-lg w-full"
                      >
                        <FiLogOut /> <span>Cerrar sesión</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
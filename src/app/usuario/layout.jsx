"use client";

import { useSession, signOut } from "next-auth/react";
import { WrappedNextRouterError } from "next/dist/server/route-modules/app-route/module";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import PreferenciasWizard from "../components/PreferenciasWizard";
import {
  FiLogOut,
  FiUser,
  FiSettings,
  FiMenu,
  FiEdit,
  FiHeart,
  FiClock,
  FiSearch,
} from "react-icons/fi";
import RecetaAleatoria from "../recetas/RecetaAleatoria";
import Notificaciones from "../components/Notificaciones/Notificaciones";
import Footer from "../components/Footer/Footer";




export default function Layout({ children }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);

  useEffect(() => {
    if (session && typeof window !== "undefined") {
      const alreadyShown = sessionStorage.getItem("recetaAleatoriaMostrada");
      if (!alreadyShown) {
        setShowPopup(true);
        sessionStorage.setItem("recetaAleatoriaMostrada", "true");
      }
    }
  }, [session]);

  useEffect(() => {
    let intervalo;

    async function fetchNotificaciones() {
      if (session?.user) {
        try {
          const res = await fetch(
            `/api/notificaciones?usuarioId=${session.user.id}`
          );
          const data = await res.json();
          setNotificaciones(data);
        } catch (error) {
          console.error("Error al cargar notificaciones:", error);
        }
      }
    }

    if (session?.user) {
      fetchNotificaciones(); // primer fetch
      intervalo = setInterval(fetchNotificaciones, 10000); // cada 10 segundos
    }

    return () => clearInterval(intervalo); // limpiar al desmontar
  }, [session]);

  const notificacionesNoLeidas = notificaciones.filter(
    (notif) => !notif.leida
  ).length;

  // Consulta el estado de primerInicioSesion
  useEffect(() => {
    const verificarPrimerInicio = async () => {
      if (session?.user) {
        try {
          const res = await fetch("/api/usuario/primerInicio", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });

          if (!res.ok) {
            throw new Error("Error al verificar el primer inicio de sesión");
          }

          const data = await res.json();
          //console.log("Respuesta de la API:", data);

          // Si `primerInicioSesion` es false, muestra el wizard
          if (data.primerInicioSesion === false) {
            setShowWizard(true);
          }
        } catch (error) {
          console.error(
            "Error al verificar el primer inicio de sesión:",
            error
          );
        }
      }
    };

    verificarPrimerInicio();
  }, [session]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
    sessionStorage.removeItem("recetaAleatoriaMostrada");
  };

  const handleWizardComplete = async () => {
    setShowWizard(false);
  };

  return (
<div className="min-h-screen bg-gray-50">

      {showPopup && <RecetaAleatoria onClose={() => setShowPopup(false)} />}

      {/* Navbar moderno y minimalista */}
      <header className="bg-white border-b border-gray-200 text-gray-700 ">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo y título */}
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => router.push("/usuario")}
            >
              <h1 className="text-2xl font-bold text-gray-800">ChefPick</h1>
            </div>

            {/* Menú de navegación principal */}
            <nav className="hidden md:flex space-x-8 ">
              <button
                className="px-3 py-2 hover:text-[#a32c7a] transition font-medium"
                onClick={() => router.push("/usuario")}
              >
                Recetas
              </button>
              <button
                className="px-3 py-2 hover:text-[#a32c7a] transition font-medium"
                onClick={() => router.push("/usuario/mapa")}
              >
                Mapa global
              </button>
              <button
                className="px-3 py-2 hover:text-[#a32c7a] transition font-medium"
                onClick={() => router.push("/usuario/listaCompras")}
              >
                Lista de compras
              </button>
              <button
                className="px-3 py-2 hover:text-[#a32c7a] transition font-medium"
                onClick={() => router.push("/usuario/crearReceta")}
              >
                Crear Receta
              </button>
            </nav>
            {/* Agrupamos notificaciones y perfil para alinearlos mejor */}
            <div className="flex items-center gap-x-4">
              {/* Ícono de notificaciones */}
              <div className="relative">
                <button
                  className="relative text-gray-600 hover:text-[#8B1C62] focus:outline-none"
                  onClick={() =>
                    setMostrarNotificaciones(!mostrarNotificaciones)
                  }
                >
                  <IoNotificationsOutline size={24} />
                  {notificacionesNoLeidas > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                      {notificacionesNoLeidas}
                    </span>
                  )}
                </button>
                {mostrarNotificaciones && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
                    <Notificaciones usuarioId={session.user.id} onClose={() =>setMostrarNotificaciones(false)} />
                  </div>
                )}
              </div>

              {/* Avatar y menú desplegable */}
              {session?.user && (
                <div className="relative">
                  <button
                    className="flex items-center space-x-2 focus:outline-none"
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                  >
                    {session.user.fotoPerfil ? (
                      <img
                        src={session.user.fotoPerfil}
                        alt="Foto de perfil"
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <FiUser className="text-gray-600 text-xl" />
                      </div>
                    )}
                  </button>

                  {/* Menú desplegable */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {session.user.nombre || session.user.email}
                        </p>
                      </div>
                      <button
                        onClick={() => router.push("/usuario/perfil")}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left text-sm"
                      >
                        <FiUser className="mr-2" /> Mi perfil
                      </button>
                      
                      <button
                        onClick={handleSignOut}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left text-sm border-t border-gray-100"
                      >
                        <FiLogOut className="mr-2" /> Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Menú móvil */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 focus:outline-none"
              >
                <FiMenu className="text-2xl text-gray-600" />
              </button>
            </div>
          </div>

          {/* Menú móvil desplegable */}
          {isMenuOpen && (
            <div className="md:hidden bg-white mt-2 rounded-lg shadow-md p-4 border border-gray-200">
              <div className="flex flex-col space-y-3">
                <button
                  className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-left"
                  onClick={() => router.push("/usuario")}
                >
                  <span>Recetas</span>
                </button>
                <button
                  className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-left"
                  onClick={() => router.push("/usuario/mapa")}
                >
                  <span>Mapa Global</span>
                </button>
                <button
                  className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-left"
                  onClick={() => router.push("/usuario/listaCompras")}
                >
                  <span>Lista de compras</span>
                </button>
                <button
                  className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-left"
                  onClick={() => router.push("/usuario/crearReceta")}
                >
                  <span>Crear Receta</span>
                </button>

                {session?.user && (
                  <>
                    <div className="border-t border-gray-200 pt-3 mt-2">
                      <div className="flex items-center space-x-3 px-3 py-2">
                        {session.user.image ? (
                          <img
                            src={session.user.image}
                            alt="Foto de perfil"
                            className="w-8 h-8 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <FiUser className="text-gray-600" />
                          </div>
                        )}
                        <span className="font-medium">
                          {session.user.nombre || session.user.email}
                        </span>
                      </div>
                      <button
                        className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 rounded-lg w-full text-left"
                        onClick={() => router.push("/usuario/perfil")}
                      >
                        <FiUser className="text-gray-600" />{" "}
                        <span>Mi perfil</span>
                      </button>
                     
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg w-full text-left"
                      >
                        <FiLogOut className="text-gray-600" />{" "}
                        <span>Cerrar sesión</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
  {/* <main className="container mx-auto px-4 py-8">{children}</main> */}
<main className=" mx-auto  py-8">{children}</main>

  <Footer />
      {/* Mostrar el wizard solo si es el primer inicio de sesión */}
      {showWizard && (
        <PreferenciasWizard
          onComplete={handleWizardComplete}
          onClose={() => setShowWizard(false)}
        />
      )}
    </div>
  );
}

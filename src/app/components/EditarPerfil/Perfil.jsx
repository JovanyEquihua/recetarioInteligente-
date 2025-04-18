"use client";
import { useState } from "react";
import EditarPerfil from "./EditarPerfil";

export default function Perfil({ user }) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);
  const [activeTab, setActiveTab] = useState('saved');
  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    setMostrarModal(false);
  };

  const nombreCompleto = `${currentUser.nombre || ""} ${
    currentUser.apellidoP || ""
  } ${currentUser.apellidoM || ""}`.trim();

  const [preferencias, setPreferencias] = useState(null);
  const sabores = preferencias?.sabores || [];
  const tiposComida = preferencias?.tiposComida || [];

  const obtenerPreferencias = async () => {
    try {
      const res = await fetch("/api/usuario/preferencias");
      if (!res.ok) throw new Error("No se pudieron obtener las preferencias");
      const data = await res.json();
      setPreferencias(data.preferencias);
    } catch (error) {
      console.error("Error al obtener preferencias:", error);
    }
  };

  return (
  
        <div className="relative">
          {/* Fondo difuminado si hay modal */}
          <div className={`${mostrarModal ? "blur-sm pointer-events-none select-none" : ""}`}>
            <div className="flex flex-col items-center mt-10 px-4 text-center">
              <img
                src={currentUser.fotoPerfil || "/images/foto-de-perfil.png"}
                alt="Foto de perfil"
                className="w-28 h-28 rounded-full object-cover shadow"
              />
      
              <h2 className="text-2xl font-semibold mt-4 text-black">
                {nombreCompleto || "Nombre no disponible"}
              </h2>
              <p className="text-sm text-gray-600">
                {currentUser.titulo || "Sin descripción"}
              </p>
      
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                <button
                  onClick={() => setMostrarModal(true)}
                  className="bg-[#8B1C62] hover:bg-[#a32c7a] text-white font-medium px-4 py-2 rounded-full transition"
                >
                  Editar Perfil
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-full">
                  Recetas guardadas
                </button>
              </div>
      
              {/* Sistema de pestañas */}
              <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
                <button 
                  onClick={() => setActiveTab('saved')}
                  className={`border px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                    activeTab === 'saved' ? 'bg-gray-100 text-[#8B1C62]' : 'hover:bg-gray-50'
                  }`}
                >
                  <span>🔖</span> Recetas guardadas
                </button>
                <button
                  onClick={() => {
                    setActiveTab('favorites');
                    obtenerPreferencias();
                  }}
                  className={`border px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                    activeTab === 'favorites' ? 'bg-gray-100 text-[#8B1C62]' : 'hover:bg-gray-50'
                  }`}
                >
                  <span>❤️</span> Ingredientes favoritos
                </button>
                <button 
                  onClick={() => setActiveTab('history')}
                  className={`border px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                    activeTab === 'history' ? 'bg-gray-100 text-[#8B1C62]' : 'hover:bg-gray-50'
                  }`}
                >
                  <span>🕒</span> Historial de actividad
                </button>
              </div>
      
              {/* Contenido de las pestañas */}
              <div className="mt-6 w-full max-w-lg mx-auto">
                {activeTab === 'favorites' && preferencias && (
                  <div className="bg-gray-50 p-4 rounded-xl shadow animate-fadeIn">
                    <h3 className="text-lg font-bold text-[#8B1C62] mb-2">
                      Tus preferencias:
                    </h3>
      
                    <div className="mb-3">
                      <p className="font-medium text-gray-700">Sabores:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {preferencias.sabores?.map((sabor, i) => (
                          <span
                            key={i}
                            className="bg-[#8B1C62] text-white px-3 py-1 rounded-full text-sm shadow-sm"
                          >
                            {sabor}
                          </span>
                        ))}
                      </div>
                    </div>
      
                    <div>
                      <p className="font-medium text-gray-700">Tipos de comida:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {preferencias.tiposComida?.map((tipo, i) => (
                          <span
                            key={i}
                            className="bg-[#6B8E23] text-white px-3 py-1 rounded-full text-sm shadow-sm"
                          >
                            {tipo}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
      
                {activeTab === 'saved' && (
                  <div className="bg-gray-50 p-4 rounded-xl shadow animate-fadeIn">
                    <p className="text-gray-700">Tus recetas guardadas aparecerán aquí</p>
                  </div>
                )}
      
                {activeTab === 'history' && (
                  <div className="bg-gray-50 p-4 rounded-xl shadow animate-fadeIn">
                    <p className="text-gray-700">Tu historial de actividad aparecerá aquí</p>
                  </div>
                )}
              </div>
      
              {currentUser.biografia && (
                <p className="mt-6 max-w-xl text-gray-700">
                  {currentUser.biografia}
                </p>
              )}
      
              {/* Galería de imágenes */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 w-full max-w-4xl px-4">
                <img
                  src="/platillo1.jpg"
                  alt="Receta 1"
                  className="rounded-lg shadow object-cover w-full h-48"
                />
                <img
                  src="/platillo2.jpg"
                  alt="Receta 2"
                  className="rounded-lg shadow object-cover w-full h-48"
                />
                <img
                  src="/platillo3.jpg"
                  alt="Receta 3"
                  className="rounded-lg shadow object-cover w-full h-48"
                />
              </div>
            </div>
          </div>
      
          {/* Modal con animación y fondo difuminado */}
          {mostrarModal && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="relative bg-white rounded-2xl w-full max-w-md shadow-xl transform scale-95 opacity-0 animate-fadeInZoom p-0 sm:p-6 overflow-visible">
                <button
                  onClick={() => setMostrarModal(false)}
                  className="absolute top-3 right-3 text-[#8B1C62] hover:rotate-90 transition-transform z-50"
                  aria-label="Cerrar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
      
                <EditarPerfil
                  user={currentUser}
                  onSave={handleUpdateUser}
                  onClose={() => setMostrarModal(false)}
                />
              </div>
            </div>
          )}
        </div>
      );
}
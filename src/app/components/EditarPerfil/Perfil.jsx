"use client";
import { useState, useEffect } from "react";
import EditarPerfil from "./EditarPerfil";

export default function Perfil({ user }) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const [activeTab, setActiveTab] = useState('saved');
  const [preferencias, setPreferencias] = useState(null);

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    setMostrarModal(false);
  };

  const nombreCompleto = `${currentUser.nombre || ""} ${
    currentUser.apellidoP || ""
  } ${currentUser.apellidoM || ""}`.trim();

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

  useEffect(() => {
    if (activeTab === 'favorites') {
      obtenerPreferencias();
    }
  }, [activeTab]);

  return (
    <div className="relative max-w-5xl mx-auto px-4 py-8">
      {/* Fondo difuminado si hay modal */}
      <div className={`${mostrarModal ? "blur-sm pointer-events-none select-none" : ""}`}>
        {/* Sección superior del perfil */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <img
            src={currentUser.fotoPerfil || "/images/foto-de-perfil.png"}
            alt="Foto de perfil"
            className="w-24 h-24 rounded-full object-cover shadow"
          />
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{nombreCompleto || "Nombre no disponible"}</h1>
                <p className="text-gray-600">{currentUser.titulo || "Chef en casa"}</p>
                <p className="text-gray-500 text-sm mt-1">{currentUser.biografia || "Amante de la cocina, el buen vino y las charlas con amigos"}</p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setMostrarModal(true)}
                  className="text-[#8B1C62] hover:text-[#a32c7a] font-medium text-sm"
                >
                  Editar perfil
                </button>
                <button className="bg-[#8B1C62] hover:bg-[#a32c7a] text-white font-medium text-sm px-3 py-1 rounded">
                  Seguir
                </button>
              </div>
            </div>
            
            <div className="border-t border-gray-200 mt-4 pt-4">
              {/* Pestañas */}
              <div className="flex gap-6">
                <button 
                  onClick={() => setActiveTab('saved')}
                  className={`pb-2 text-sm font-medium ${
                    activeTab === 'saved' ? 'text-[#8B1C62] border-b-2 border-[#8B1C62]' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Recetas guardadas
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`pb-2 text-sm font-medium ${
                    activeTab === 'favorites' ? 'text-[#8B1C62] border-b-2 border-[#8B1C62]' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Ingredientes favoritos
                </button>
                <button 
                  onClick={() => setActiveTab('history')}
                  className={`pb-2 text-sm font-medium ${
                    activeTab === 'history' ? 'text-[#8B1C62] border-b-2 border-[#8B1C62]' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Actividad
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contenido de las pestañas */}
        <div className="mt-8">
          {activeTab === 'saved' && (
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold">Espagueti a la carbonara</h3>
                <p className="text-gray-500 text-sm">Hace 2 meses</p>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold">Cazuela de pollo y arroz</h3>
                <p className="text-gray-500 text-sm">Hace 2 meses</p>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold">Sopa de tomate y albahaca</h3>
                <p className="text-gray-500 text-sm">Hace 2 meses</p>
              </div>
            </div>
          )}
          
          {activeTab === 'favorites' && (
            <div className="space-y-6">
              {preferencias ? (
                <>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Sabores preferidos</h3>
                    <div className="flex flex-wrap gap-2">
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
                    <h3 className="text-lg font-semibold mb-3">Tipos de comida favoritos</h3>
                    <div className="flex flex-wrap gap-2">
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
                </>
              ) : (
                <p className="text-gray-500">Cargando preferencias...</p>
              )}
            </div>
          )}
          
          {activeTab === 'history' && (
            <div className="bg-gray-50 p-4 rounded-xl shadow animate-fadeIn">
              <p className="text-gray-700">Tu historial de actividad aparecerá aquí</p>
            </div>
          )}
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
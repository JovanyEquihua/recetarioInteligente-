"use client";
import React, { useState } from "react"; // Importa React y el hook useState para manejar el estado
import { Search } from "lucide-react"; // Importa el ícono de búsqueda desde la biblioteca lucide-react

// Componente principal del buscador
const BuscadorPage = () => {
// Estados para manejar la consulta, los resultados y el estado de carga
  const [query, setQuery] = useState("");// Estado para almacenar el texto ingresado por el usuario
  const [resultados, setResultados] = useState([]);// Estado para almacenar los resultados de la búsqueda
  const [loading, setLoading] = useState(false);// Estado para indicar si la búsqueda está en progreso

  
// Función para realizar la búsqueda
  const buscar = async () => { 
    if (!query.trim()) return; // Si el campo de búsqueda está vacío, no hace nada

    setLoading(true);// Activa el estado de carga

    try {
      const response = await fetch(`https://tu-api.com/buscar?query=${query}`);
      const data = await response.json();
      setResultados(data);
    } catch (error) {
      console.error("Error al buscar:", error);
    } finally {
      setLoading(false);
    }
  };
// Renderizado del componente
  return (
    <div className="  max-w-3xl  my-10 translate-y-10">
{/* Contenedor del buscador */}
      <div className="flex items-center gap-96 border border-gray-300 bg-white bg-opacity-90 rounded-full px-4 py-2 shadow-md">
        {/* Campo de entrada para la búsqueda */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && buscar()}
          placeholder="Experimenta nuevas recetas de cocina..."
          className="flex-1 bg-transparent outline-none text-black"
        />
        {/* Botón buscar */}
        <button
          onClick={buscar}
          className="text-purple-700 hover:text-purple-900"
        >
         {/* Icon buscador */}
          <Search size={20} />
        </button>
      </div>
{/* Mensaje de carga o resultados */}
      {loading ? (
        <p className="text-center mt-4">Buscando...</p>
      ) : (
        // Lista de resultados 
        <ul className="mt-6 space-y-3">
          {resultados.length > 0
            ? resultados.map((item, idx) => (
                <li key={idx} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-semibold text-lg">{item.titulo}</h3>
                  <p className="text-sm text-gray-600">{item.descripcion}</p>
                </li>
              ))
            : query && (
                <p className="text-center mt-4 text-white">
                  No se encontraron resultados.
                </p>
              )}
        </ul>
      )}
    </div>
  );
};

export default BuscadorPage;

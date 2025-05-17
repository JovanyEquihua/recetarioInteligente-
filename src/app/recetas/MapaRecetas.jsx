"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useMemo } from "react";

// Configuración de iconos
function createIcon(iconUrl, color) {
  if (typeof window === "undefined") return null;

  return new L.Icon({
    iconUrl,
    iconSize: [25, 40],
    iconAnchor: [12, 40],
    popupAnchor: [1, -34],
    shadowSize: [40, 40],
    className: `marker-icon-${color.replace("#", "")}`,
  });
}


// Componente para resetear la vista del mapa
function ResetMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function MapaRecetasCompacto() {
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCountry, setActiveCountry] = useState(null);
  const [mapCenter, setMapCenter] = useState([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);
  const [datosRecetas, setDatosRecetas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener recetas desde tu API
  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        const response = await fetch("/api/recetas/paises");
        if (!response.ok) throw new Error("Error al obtener recetas");
        const data = await response.json();
        setDatosRecetas(data);
      } catch (err) {
        console.error("Error fetching recipes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecetas();
  }, []);

  // Inicializar mapa
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      L.Marker.prototype.options.icon = createIcon(
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        "#000000"
      );
    }
  }, []);

  // Filtrar recetas basado en búsqueda
  const filteredCountries = useMemo(() => {
    if (!datosRecetas) return [];

    return datosRecetas
      .map((country) => {
        const filteredRecipes = country.recetas.filter((recipe) =>
          recipe.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return {
          ...country,
          recetas: filteredRecipes,
          hasMatches: filteredRecipes.length > 0,
        };
      })
      .filter((country) => country.hasMatches);
  }, [searchTerm, datosRecetas]);

  // Centrar mapa en un país
  const centerOnCountry = (countryId) => {
    const country = datosRecetas.find((c) => c.id === countryId);
    if (country) {
      setMapCenter([country.lat, country.lng]);
      setMapZoom(5);
      setActiveCountry(countryId);
    }
  };

  // Resetear vista del mapa
  const resetMapView = () => {
    setMapCenter([20, 0]);
    setMapZoom(2);
    setActiveCountry(null);
  };

  if (!isClient) return null;

  if (loading) {
    return <div className="text-center p-8">Cargando recetas...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
        Recetas del Mundo 🌍
      </h1>

      {/* Controles de búsqueda */}
      <div className="bg-white rounded-lg shadow-sm p-3 mb-4">
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <input
            type="text"
            placeholder="Buscar recetas..."
            className="flex-grow p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={resetMapView}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 px-3 rounded-md transition"
          >
            Resetear Mapa
          </button>
        </div>

        {/* Lista de países filtrados - más compacta */}
        {filteredCountries.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {filteredCountries.map((country) => (
              <button
                key={country.id}
                onClick={() => centerOnCountry(country.id)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${
                  activeCountry === country.id
                    ? "bg-blue-50 border border-blue-200"
                    : "bg-gray-50"
                }`}
              >
                <span>{country.bandera}</span>
                <span>{country.pais}</span>
                <span className="text-gray-400">
                  ({country.recetas.length})
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Mapa */}
        <div className="lg:w-2/3">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: "500px", width: "100%", borderRadius: "6px" }}
            className="shadow-md"
          >
            <ResetMapView center={mapCenter} zoom={mapZoom} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {filteredCountries.map((pais) => (
              <Marker
                key={pais.id}
                position={[pais.lat, pais.lng]}
                icon={createIcon(
                  "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
                  pais.color
                )}
                eventHandlers={{
                  mouseover: (e) => e.target.openPopup(),
                  click: () => centerOnCountry(pais.id),
                }}
              >
                <Popup
                  className="custom-popup"
                  maxWidth={300}
                  minWidth={180}
                  autoPan={true}
                >
                  <div
                    className="popup-content"
                    style={{ borderLeft: `3px solid ${pais.color}` }}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-xl">{pais.bandera}</span>
                      <h3 className="font-bold text-sm">{pais.pais}</h3>
                    </div>
                    <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {pais.recetas.map((receta) => (
                        <li key={receta.id}>
                          <a
                            href={`/usuario/recetas/${receta.id}`}
                            className="flex items-center space-x-3 bg-white rounded-lg shadow p-2 hover:bg-gray-50 transition block"
                          >
                            {receta.imagen && (
                              <img
                                src={receta.imagen}
                                alt={receta.nombre}
                                className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-800 truncate">
                                {receta.nombre}
                              </h4>
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Panel lateral informativo (sin favoritos) */}
        <div className="lg:w-1/3 bg-white rounded-lg shadow-sm p-3 h-fit sticky top-4">
          <h2 className="text-lg font-semibold mb-2">Explora recetas</h2>
          <p className="text-sm text-gray-600 mb-3">
            Haz clic en los marcadores del mapa o en los países arriba para ver
            las recetas.
          </p>

          {filteredCountries.length === 0 && (
            <p className="text-sm text-gray-500">
              {searchTerm
                ? "No hay recetas que coincidan con tu búsqueda"
                : "No hay recetas para mostrar"}
            </p>
          )}

          {activeCountry && (
            <div className="mt-2">
              <h3 className="font-medium text-sm flex items-center gap-1">
                {datosRecetas.find((c) => c.id === activeCountry)?.bandera}
                {datosRecetas.find((c) => c.id === activeCountry)?.pais}
              </h3>
              <p className="text-xs text-gray-500 mb-2">
                {
                  datosRecetas.find((c) => c.id === activeCountry)?.recetas
                    .length
                }{" "}
                recetas
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

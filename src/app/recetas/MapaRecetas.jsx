"use client";
import { useEffect, useState } from 'react';
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const coordenadasPais = {
  México: [23.6345, -102.5528],
  Japón: [36.2048, 138.2529],
  Italia: [41.8719, 12.5674],
  India: [20.5937, 78.9629],
  Francia: [46.2276, 2.2137],
  China: [35.8617, 104.1954],
  'Estados Unidos': [37.0902, -95.7129],
  Perú: [-9.19, -75.0152],
  // Agrega más si necesitas
};

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapaRecetas() {
  const [recetas, setRecetas] = useState({});

  useEffect(() => {
    fetch('/api/recetas/paises')
      .then((res) => res.json())
      .then(setRecetas)
      .catch(console.error);
  }, []);

  return (
    <div className="w-full h-[600px]">
      <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom={true} className="h-full w-full z-0">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {Object.entries(recetas).map(([pais, recetasPais]) => {
          const coords = coordenadasPais[pais];
          if (!coords) return null;

          return (
            <Marker key={pais} position={coords} icon={customIcon}>
              <Popup>
                <strong>{pais}</strong>
                <ul className="list-disc list-inside mt-2">
                  {recetasPais.map((receta) => (
                    <li key={receta.id}>
                      {receta.titulo} <br />
                      <em>por {receta.usuario}</em>
                    </li>
                  ))}
                </ul>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

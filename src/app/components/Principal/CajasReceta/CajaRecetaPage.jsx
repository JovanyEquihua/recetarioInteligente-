import React from 'react'

const CajaRecetaPage = ({ imagen, titulo, descripcion }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl
    transition-shadow duration-300 max-w-xs">
    <img src={imagen} alt={titulo} className="w-full h-40 object-cover" />
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-800">{titulo}</h3>
      <p className="mt-1 text-sm text-gray-600">{descripcion}</p>
    </div>
  </div>
  )
}

export default CajaRecetaPage

'use client'

import dynamic from 'next/dynamic'
import React from 'react'

// Importa el componente de forma dinámica sin SSR
const MapaRecetas = dynamic(() => import('@/app/recetas/MapaRecetasP'), {
  ssr: false,
})

const Page = () => {
  return (
    <div>
      <MapaRecetas />
    </div>
  )
}

export default Page

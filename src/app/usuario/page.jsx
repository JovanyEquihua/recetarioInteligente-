'use client'
import React from 'react'
import Filtrar from '../recetas/Filtrar'
import PreferenciasWizard from '../components/PreferenciasWizard'
import Busqueda from '../recetas/Busqueda'

const page = () => {
  return (
    <div >
    
    <Filtrar />
    <Busqueda />
  
  </div>
  )
}

export default page
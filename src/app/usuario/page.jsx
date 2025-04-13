import React from 'react'
import Filtrar from '../recetas/Filtrar'

const page = () => {
  return (
    <div className="p-4">
    <h2 className="text-xl font-bold">Bienvenido al panel de usuario</h2>
    <p>Aquí puedes gestionar tu cuenta y ver tus datos.</p>
    <Filtrar/>
  </div>
  )
}

export default page
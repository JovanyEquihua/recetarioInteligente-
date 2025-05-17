// app/not-found.js
"use client"; // Esto soluciona el error de document

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-xl">Página no encontrada</p>
    </div>
  )
}
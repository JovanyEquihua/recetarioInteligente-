"use client";
import { useEffect, useState } from "react";

export default function ModoCocina({ pasos }) {
  const [modoActivo, setModoActivo] = useState(false);
  const [pasoActual, setPasoActual] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(null);
  const [temporizadorActivo, setTemporizadorActivo] = useState(false);
  const [recetaCompletada, setRecetaCompletada] = useState(false);

  const paso = pasos[pasoActual];

  useEffect(() => {
    if (modoActivo && paso?.paso) {
      leerPaso(paso.paso);
    }
  }, [pasoActual, modoActivo]);

  useEffect(() => {
    if (modoActivo && paso?.tiempo) {
      setTiempoRestante(paso.tiempo * 60);
      setTemporizadorActivo(true);
    } else {
      setTiempoRestante(null);
      setTemporizadorActivo(false);
    }
  }, [modoActivo, pasoActual]);

  useEffect(() => {
    if (temporizadorActivo && tiempoRestante > 0) {
      const timer = setInterval(() => {
        setTiempoRestante((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }

    if (tiempoRestante === 0) {
      avanzarPaso();
    }
  }, [tiempoRestante, temporizadorActivo]);

  function avanzarPaso() {
    detenerLectura();
    if (pasoActual < pasos.length - 1) {
      setPasoActual((prev) => prev + 1);
    } else {
      leerPaso("¡Receta completada!");
      setRecetaCompletada(true);
      setModoActivo(false);
      setTimeout(() => {
        reiniciarModo();
      }, 4000);
    }
  }

  function formatearTiempo(segundos) {
    const m = Math.floor(segundos / 60);
    const s = segundos % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function leerPaso(texto) {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = "es-MX";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }

  function detenerLectura() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }
  function retrocederPaso() {
    detenerLectura();
    if (pasoActual > 0) {
      setPasoActual((prev) => prev - 1);
    }
  }
  function reiniciarModo() {
    detenerLectura();
    setPasoActual(0);
    setModoActivo(false);
    setTiempoRestante(null);
    setTemporizadorActivo(false);
    setRecetaCompletada(false);
  }

  return (
    <div className="mt-6 bg-white border border-[#f0e6ed] p-8 rounded-2xl shadow-sm max-w-2xl mx-auto">
      {!modoActivo ? (
        <div className="text-center">
          {recetaCompletada ? (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#8B1C62] mb-2">
                ¡Receta completada!
              </h2>
              <p className="text-gray-600">¿Preparar de nuevo?</p>
            </div>
          ) : (
            <h2 className="text-xl font-semibold text-gray-700 mb-6">
              Modo Cocina Paso a Paso
            </h2>
          )}
          <button
            onClick={() => setModoActivo(true)}
            className="bg-[#8B1C62] text-white px-8 py-3 rounded-lg hover:bg-[#7a1756] transition-all text-lg font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#8B1C62] focus:ring-opacity-50"
          >
            Iniciar Modo Cocina
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <span className="bg-[#8B1C62] text-white text-sm font-medium px-3 py-1 rounded-full mr-3">
                {pasoActual + 1}/{pasos.length}
              </span>
              <h3 className="text-lg font-semibold text-gray-800">
                Instrucción actual
              </h3>
            </div>
            <button
              onClick={reiniciarModo}
              className="text-[#8B1C62] hover:text-[#6B8E23] text-sm font-medium transition-colors"
            >
              Reiniciar
            </button>
          </div>

          <div className="bg-[#faf5f9] border-l-4 border-[#8B1C62] p-4 mb-6 rounded-r-lg">
            <p className="text-gray-800">{paso.paso}</p>
          </div>

          {paso.tiempo ? (
            <div className="relative w-28 h-28 mx-auto mb-5">
              {" "}
              {/* Reducido de w-32 h-32 a w-20 h-20 */}
              <svg className="w-full h-full" viewBox="0 0 36 36">
                {/* Fondo del círculo */}
                <path
                  d="M18 2.0845
        a 15.9155 15.9155 0 0 1 0 31.831
        a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#f0e6ed"
                  strokeWidth="2"
                />

                {/* Arco de progreso */}
                <path
                  d="M18 2.0845
        a 15.9155 15.9155 0 0 1 0 31.831
        a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#8B1C62"
                  strokeWidth="2"
                  strokeDasharray={`${
                    100 - (tiempoRestante / (paso.tiempo * 60)) * 100
                  }, 100`}
                />

                {/* Texto en el centro - Tiempo */}
                <text
                  x="18"
                  y="20.5"
                  textAnchor="middle"
                  fill="#6B8E23"
                  fontSize="9"
                  fontFamily="Arial"
                  fontWeight="bold"
                >
                  {formatearTiempo(tiempoRestante)}
                </text>

                {/* Texto en el centro - Porcentaje */}
                <text
                  x="18"
                  y="25"
                  textAnchor="middle"
                  fill="#8B1C62"
                  fontSize="3"
                  fontFamily="bold"
                >
                  {Math.round((1 - tiempoRestante / (paso.tiempo * 60)) * 100)}%
                  completado
                </text>
              </svg>
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic mb-6">
              Este paso no requiere tiempo específico
            </p>
          )}

          <div className="flex flex-wrap gap-3 justify-center">
            {/* Botón Paso Anterior */}
            <button
              onClick={retrocederPaso}
              className={`px-5 py-2.5 rounded-lg transition-colors font-medium shadow-sm flex items-center justify-center gap-2
      ${
        pasoActual === 0
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800 border border-gray-300"
      }
    `}
              disabled={pasoActual === 0}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Anterior
            </button>

            {/* Botón Siguiente Paso */}
            <button
              onClick={avanzarPaso}
              className="bg-[#8B1C62] text-white px-5 py-2.5 rounded-lg hover:bg-[#7a1756] transition-colors font-medium shadow-sm flex items-center justify-center gap-2"
            >
              Siguiente
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Botón Leer Paso */}
            <button
              onClick={() => leerPaso(paso.paso)}
              className="bg-white text-[#8B1C62] border border-[#8B1C62] px-5 py-2.5 rounded-lg hover:bg-[#faf5f9] transition-colors font-medium flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
              Leer
            </button>

            {/* Botón Detener Lectura */}
            <button
              onClick={detenerLectura}
              className="bg-white text-gray-600 border border-gray-300 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                />
              </svg>
              Detener
            </button>
          </div>
        </>
      )}
    </div>
  );
}

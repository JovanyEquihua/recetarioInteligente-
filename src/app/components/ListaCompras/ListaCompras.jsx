"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ListaCompras({ usuarioId }) {
  const [items, setItems] = useState([]);
  const [nuevoItem, setNuevoItem] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [grabando, setGrabando] = useState(false);
  const reconocimientoVoz = useRef(null);
  const generarMensajeWhatsApp = () => {
    if (items.length === 0) return "";
  
    return items.map(item => `${item.cantidad} x ${item.nombreIngrediente}`).join('\n');
  };
  const enviarPorWhatsApp = () => {
    const mensaje = generarMensajeWhatsApp();
    if (!mensaje) return;
  
    const url = `https://wa.me/?text=${encodeURIComponent("🛒 Lista de Compras:\n" + mensaje)}`;
    window.open(url, '_blank');
  };
  
  // Cargar items iniciales
  useEffect(() => {
    cargarItems();
  }, []);

  const cargarItems = async () => {
    try {
      const res = await fetch(`/api/lista-compras?usuarioId=${usuarioId}`);
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Error cargando lista:", error);
    }
  };

  // Configurar reconocimiento de voz
  useEffect(() => {
    reconocimientoVoz.current = new window.webkitSpeechRecognition();
    reconocimientoVoz.current.continuous = false;
    reconocimientoVoz.current.interimResults = false;
    reconocimientoVoz.current.lang = 'es-MX'; // o 'es-CO' si estás en Colombia
  
    reconocimientoVoz.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Texto dictado:", transcript); // 👈 DEBERÍA MOSTRAR ALGO
      procesarDictado(transcript);
    };
  
    reconocimientoVoz.current.onerror = (event) => {
      console.error("Error en reconocimiento de voz:", event.error); // 👈 AÑADE ESTO
    };
  }, []);

  const palabrasANumeros = {
    uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5,
    seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10
  };
  
  const procesarDictado = (texto) => {
    const comando = texto.toLowerCase().trim();
    console.log("Texto dictado:", comando);
  
    let textoLimpio = comando.replace(/enviar|siguiente/gi, "").trim();
  
    // Convertir palabras a números si es necesario
    Object.entries(palabrasANumeros).forEach(([palabra, numero]) => {
      const regex = new RegExp(`\\b${palabra}\\b`, 'gi');
      textoLimpio = textoLimpio.replace(regex, numero.toString());
    });
  
    const match = textoLimpio.match(/^(\d+)\s*(.*)/);
    if (match) {
      setCantidad(parseInt(match[1]));
      setNuevoItem(match[2].trim());
    } else {
      setNuevoItem(textoLimpio);
    }
  
    if (comando.includes("enviar") || comando.includes("siguiente")) {
      setTimeout(() => {
        agregarItem();
      }, 300); // espera breve para que setNuevoItem se actualice
    }
  
    setGrabando(false);
  };
  

  const iniciarDictado = () => {
    if (reconocimientoVoz.current) {
        reconocimientoVoz.current.start();
        console.log("Dictado iniciado...");
      }
  };

  const agregarItem = async () => {
    if (!nuevoItem.trim()) return;

    try {
      const res = await fetch('/api/lista-compras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId,
          nombreIngrediente: nuevoItem,
          cantidad
        }),
      });

      if (res.ok) {
        setNuevoItem('');
        setCantidad(1);
        cargarItems();
      }
    } catch (error) {
      console.error("Error agregando item:", error);
    }
  };

  const eliminarItem = async (id) => {
    try {
      const res = await fetch(`/api/lista-compras?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        cargarItems();
      }
    } catch (error) {
      console.error("Error eliminando item:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-xl shadow-lg">
    <h1 className="text-2xl font-bold text-[#8B1C62] mb-4">Lista de Compras</h1>
    
    {/* Formulario para agregar nuevos items */}
    <div className="mb-6 p-4 bg-[#faf5f9] rounded-lg border border-[#f0e6ed]">
      <div className="flex gap-2 mb-3">
        <input
          type="number"
          min="1"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          className="w-16 px-2 py-1 border border-[#8B1C62]/30 rounded text-center"
        />
        <input
          type="text"
          value={nuevoItem}
          onChange={(e) => setNuevoItem(e.target.value)}
          placeholder="Ej: tomates, lechuga..."
          className="flex-1 px-3 py-1 border border-[#8B1C62]/30 rounded"
        />
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={agregarItem}
          className="flex-1 bg-[#8B1C62] text-white px-4 py-2 rounded hover:bg-[#6B8E23] transition"
        >
          Agregar
        </button>
        
        <button
          onClick={iniciarDictado}
          className={`flex items-center gap-1 px-3 py-2 rounded transition ${
            grabando 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-[#6B8E23] text-white hover:bg-[#5a7d1a]'
          }`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
              clipRule="evenodd"
            />
          </svg>
          {grabando ? 'Grabando...' : 'Dictar'}
        </button>
      </div>
    </div>

    {/* Lista de items */}
    <div className="space-y-2">
      <AnimatePresence>
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-500"
          >
            Tu lista de compras está vacía
          </motion.div>
        ) : (
          items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex justify-between items-center p-3 bg-white border border-[#f0e6ed] rounded-lg hover:shadow-sm"
            >
              <span className="flex-1">
                <span className="font-medium text-[#8B1C62]">{item.cantidad}</span> {item.nombreIngrediente}
              </span>
              <button
                onClick={() => eliminarItem(item.id)}
                className="text-red-500 hover:text-red-700 p-1"
                aria-label="Eliminar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </motion.div>
          ))
        )}
        {items.length > 0 && (
  <button
    onClick={enviarPorWhatsApp}
    className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
  >
    Enviar por WhatsApp
  </button>
)}
      </AnimatePresence>
    </div>
  </div>
  );
}
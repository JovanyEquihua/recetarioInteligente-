"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ListaCompras({ usuarioId }) {
  const [items, setItems] = useState([]);
  const [nuevoItem, setNuevoItem] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [grabando, setGrabando] = useState(false);
  const [notificacion, setNotificacion] = useState({ mensaje: '', tipo: '' });
  const reconocimientoVoz = useRef(null);
const [mostrarAyudaVoz, setMostrarAyudaVoz] = useState(false);
  const [ultimoComando, setUltimoComando] = useState('');
  const [transcripcion, setTranscripcion] = useState('');

  // Cargar items iniciales
  useEffect(() => {
    cargarItems();
    setupReconocimientoVoz();
    
    // Cargar desde localStorage si existe
    const datosLocales = localStorage.getItem('listaComprasTemp');
    if (datosLocales) setItems(JSON.parse(datosLocales));
  }, []);

  const mostrarNotificacion = (mensaje, tipo = 'exito') => {
    setNotificacion({ mensaje, tipo });
    setTimeout(() => setNotificacion({ mensaje: '', tipo: '' }), 3000);
  };

 const cargarItems = async () => {
  try {
    const res = await fetch(`/api/lista-compras?usuarioId=${usuarioId}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      setItems(data);
      localStorage.setItem('listaComprasTemp', JSON.stringify(data));
    } else {
      console.error("La respuesta de la API no es un arreglo:", data);
      setItems([]);
    }
  } catch (error) {
    console.error("Error cargando lista:", error);
    mostrarNotificacion('Error cargando la lista', 'error');
    setItems([]);
  }
};

  const setupReconocimientoVoz = () => {
    if ('webkitSpeechRecognition' in window) {
      reconocimientoVoz.current = new window.webkitSpeechRecognition();
      reconocimientoVoz.current.continuous = false;
      reconocimientoVoz.current.interimResults = false;
      reconocimientoVoz.current.lang = 'es-ES';
  
      reconocimientoVoz.current.onstart = () => setGrabando(true);
      reconocimientoVoz.current.onend = () => setGrabando(false);
  
      reconocimientoVoz.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        console.log("Texto dictado:", transcript);
  
        // Mapeo de palabras a números
        const palabrasANumeros = {
          uno: 1,
          dos: 2,
          tres: 3,
          cuatro: 4,
          cinco: 5,
          seis: 6,
          siete: 7,
          ocho: 8,
          nueve: 9,
          diez: 10,
        };
  
        // Reemplazar palabras por números
        let textoProcesado = transcript.replace(/\b(uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\b/gi, (match) => {
          return palabrasANumeros[match.toLowerCase()];
        });
  
        console.log("Texto procesado:", textoProcesado);
  
        // Comandos reconocidos
        const comandosAgregar = ['agregar', 'enviar', 'añadir', 'listo', 'guardar'];
        const contieneComando = comandosAgregar.some(cmd => textoProcesado.includes(cmd));
  
        // Extraer cantidad, unidad y nombre del ingrediente
        const matchCantidad = textoProcesado.match(/^(\d+)\s*(kg|kilos|gramos|litros|l|unidad|unidades)?\s*(.*)/i);
        let cantidadNum = 1;
        let nombreIngrediente = textoProcesado;
  
        if (matchCantidad) {
          cantidadNum = parseInt(matchCantidad[1], 10);
          nombreIngrediente = matchCantidad[3]?.trim() || '';
        }
  
        // Limpiar comandos del texto
        comandosAgregar.forEach(cmd => {
          nombreIngrediente = nombreIngrediente.replace(new RegExp(cmd, 'gi'), '').trim();
        });
  
        console.log("Cantidad detectada:", cantidadNum);
        console.log("Ingrediente detectado:", nombreIngrediente);
  
        // Si se detecta un comando, agregar automáticamente
        if (contieneComando && nombreIngrediente) {
          console.log("Comando detectado, agregando automáticamente...");
          agregarItemDirecto(cantidadNum, nombreIngrediente);
        } else if (!nombreIngrediente) {
          console.error("No se detectó un nombre válido para el ingrediente.");
        }
      };
    }
  };
  

  // Nueva función para agregar directamente un ítem
  const agregarItemDirecto = async (cantidad, nombreIngrediente) => {
    if (!nombreIngrediente.trim()) {
      mostrarNotificacion('Escribe un nombre para el item', 'error');
      return;
    }
  
    try {
      const res = await fetch('/api/lista-compras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId,
          nombreIngrediente,
          cantidad,
        }),
      });
  
      if (res.ok) {
        mostrarNotificacion('Item agregado correctamente');
        cargarItems();
      }
    } catch (error) {
      console.error("Error agregando item:", error);
      mostrarNotificacion('Error al agregar item', 'error');
    }
  };

  const iniciarDictado = () => {
    if (reconocimientoVoz.current) {
      reconocimientoVoz.current.start();
    } else {
      mostrarNotificacion('Reconocimiento de voz no disponible', 'error');
    }
  };

  const agregarItem = async () => {
    if (!nuevoItem.trim()) {
      mostrarNotificacion('Escribe un nombre para el item', 'error');
      return;
    }

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
        mostrarNotificacion('Item agregado correctamente');
        cargarItems();
      }
    } catch (error) {
      console.error("Error agregando item:", error);
      mostrarNotificacion('Error al agregar item', 'error');
    }
  };

  const eliminarItem = async (id) => {
    try {
      const res = await fetch(`/api/lista-compras?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        mostrarNotificacion('Item eliminado');
        cargarItems();
      }
    } catch (error) {
      console.error("Error eliminando item:", error);
      mostrarNotificacion('Error al eliminar item', 'error');
    }
  };

  const limpiarLista = async () => {
    try {
      const res = await fetch(`/api/lista-compras?usuarioId=${usuarioId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        mostrarNotificacion('Lista limpiada');
        cargarItems();
      }
    } catch (error) {
      console.error("Error limpiando lista:", error);
      mostrarNotificacion('Error al limpiar lista', 'error');
    }
  };

  const enviarWhatsApp = () => {
    if (items.length === 0) {
      mostrarNotificacion('La lista está vacía', 'error');
      return;
    }
    
    const mensaje = items.map(item => `${item.cantidad} x ${item.nombreIngrediente}`).join('\n');
    const url = `https://wa.me/?text=${encodeURIComponent("🛒 Lista de Compras:\n" + mensaje)}`;
    window.open(url, '_blank');
  };

  return (
      <div
 className="min-h-screen min-w-full flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/fondo-lista6.png')", // Ruta de la imagen
        backgroundSize: "cover", // Asegura que la imagen cubra toda la pantalla
        backgroundPosition: "center", // Centra la imagen
        backgroundRepeat: "no-repeat", // Evita que la imagen se repita
      
      }}
    >
     
      {/* <div className="max-w-md mx-auto bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-2xl"> */}
       <div className="  max-w-md mx-auto bg-white p-6 rounded-3xl shadow-2xl">
      <h1 className="text-3xl font-bold text-[#8B1C62] mb-4 text-center">🛒 Lista de Compras</h1>
      {/* Sección de comandos de voz */}
        <div className="mb-6 relative">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-[#8B1C62]">Comandos de voz</h3>
            <button 
              onClick={() => setMostrarAyudaVoz(!mostrarAyudaVoz)}
              className="text-sm text-[#6B8E23] hover:text-[#8B1C62] flex items-center gap-1"
            >
              {mostrarAyudaVoz ? 'Ocultar ayuda' : 'Mostrar ayuda'}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d={mostrarAyudaVoz ? "M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" : "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"} clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <AnimatePresence>
            {mostrarAyudaVoz && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-[#f8f5f9] p-4 rounded-lg mb-3">
                  <h4 className="font-medium text-[#6B8E23] mb-2">Ejemplos de comandos:</h4>
                  <ul className="space-y-2 text-sm">
                     <li className="flex items-start">
                      <span className="bg-[#8B1C62] text-white rounded-full px-2 py-1 text-xs mr-2">1</span>
                      <span>"<span className="font-semibold">3 litros de leche guardar</span>"</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-[#8B1C62] text-white rounded-full px-2 py-1 text-xs mr-2">2</span>
                      <span>"<span className="font-semibold">agregar 2 litros de leche</span>"</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-[#8B1C62] text-white rounded-full px-2 py-1 text-xs mr-2">3</span>
                      <span>"<span className="font-semibold">1kg de carne listo</span>"</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
      {notificacion.mensaje && (
        <div className={`p-3 mb-4 rounded-lg text-sm font-medium transition-all ${
          notificacion.tipo === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {notificacion.mensaje}
        </div>
      )}

      <div className="mb-6 p-4 bg-white border border-[#e8ddea] rounded-xl shadow-inner">
        <div className="flex gap-2 mb-3">
          <input
            type="number"
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            className="w-16 px-2 py-2 border border-[#8B1C62]/30 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-[#8B1C62]/40"
          />
          <input
            type="text"
            value={nuevoItem}
            onChange={(e) => setNuevoItem(e.target.value)}
            placeholder="Ej: tomates, lechuga..."
            className="flex-1 px-4 py-2 border border-[#8B1C62]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1C62]/40"
            onKeyPress={(e) => e.key === 'Enter' && agregarItem()}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={agregarItem}
            className="flex-1 bg-[#8B1C62] text-white px-4 py-2 rounded-lg hover:bg-[#731751] transition"
          >
            Agregar
          </button>
          <button
            onClick={iniciarDictado}
            disabled={grabando}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              grabando 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-[#6B8E23] text-white hover:bg-[#55761a]'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
            {grabando ? 'Grabando...' : 'Dictar'}
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-5">
        <AnimatePresence>
          
         {Array.isArray(items) && items.length === 0 ? (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-6 text-gray-500 italic"
  >
    Tu lista de compras está vacía
  </motion.div>
) : (
  Array.isArray(items) &&
  items.map((item) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex justify-between items-center p-3 bg-white border border-[#f0e6ed] rounded-xl hover:shadow-sm"
    >
      <span className="flex-1 text-[#444]">
        <span className="font-semibold text-[#8B1C62]">{item.cantidad}</span> {item.nombreIngrediente}
      </span>
      <button
        onClick={() => eliminarItem(item.id)}
        className="text-red-500 hover:text-red-700 p-1"
        title="Eliminar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6 2a1 1 0 011-1h6a1 1 0 011 1v1h4v2H2V3h4V2zm3 6a1 1 0 00-2 0v7a1 1 0 002 0V8zm4 0a1 1 0 10-2 0v7a1 1 0 002 0V8z" />
        </svg>
      </button>
    </motion.div>
  ))
)}
        </AnimatePresence>
      </div>

      <div className="flex justify-between gap-2">
       
        <button
          onClick={enviarWhatsApp}
          className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          Enviar a WhatsApp
        </button>
      </div>
    </div>
  </div>
  </div>
);
}
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
      setItems(data);
      localStorage.setItem('listaComprasTemp', JSON.stringify(data));
    } catch (error) {
      console.error("Error cargando lista:", error);
      mostrarNotificacion('Error cargando la lista', 'error');
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
    <div className="max-w-md mx-auto p-4 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-[#8B1C62] mb-2">Lista de Compras</h1>
      
      {notificacion.mensaje && (
        <div className={`p-2 mb-3 rounded ${
          notificacion.tipo === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {notificacion.mensaje}
        </div>
      )}

      <div className="mb-6 p-4 bg-[#faf5f9] rounded-lg border border-[#f0e6ed]">
        <div className="flex gap-2 mb-3">
          <input
            type="number"
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            className="w-16 px-2 py-1 border border-[#8B1C62]/30 rounded text-center"
          />
          <input
            type="text"
            value={nuevoItem}
            onChange={(e) => setNuevoItem(e.target.value)}
            placeholder="Ej: tomates, lechuga..."
            className="flex-1 px-3 py-1 border border-[#8B1C62]/30 rounded"
            onKeyPress={(e) => e.key === 'Enter' && agregarItem()}
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
            disabled={grabando}
            className={`flex items-center gap-1 px-3 py-2 rounded transition ${
              grabando 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-[#6B8E23] text-white hover:bg-[#5a7d1a]'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
            {grabando ? 'Grabando...' : 'Dictar'}
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
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
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex justify-between items-center p-3 bg-white border border-[#f0e6ed] rounded-lg hover:shadow-sm"
              >
                <span className="flex-1">
                  <span className="font-medium text-[#8B1C62]">{item.cantidad}</span> {item.nombreIngrediente}
                </span>
                <button
                  onClick={() => eliminarItem(item.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={enviarWhatsApp}
        disabled={items.length === 0}
        className={`w-full py-2 rounded transition ${
          items.length === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-green-500 text-white hover:bg-green-600'
        }`}
      >
        Enviar por WhatsApp
      </button>

      
    </div>
  );
}
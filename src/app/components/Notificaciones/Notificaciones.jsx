import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoCheckmarkDone } from 'react-icons/io5';
import { BsBellFill, BsBell } from 'react-icons/bs';
// ...importaciones sin cambios...

export default function Notificaciones({ usuarioId, onClose, onMarkAsRead }) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  useEffect(() => {
    async function fetchNotificaciones() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/notificaciones?usuarioId=${usuarioId}`);
        const data = await res.json();
        setNotificaciones(data);
      } catch (error) {
        console.error("Error al cargar notificaciones:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNotificaciones();
  }, [usuarioId]);

  const handleMarkAsRead = async (notifId) => {
    try {
      const res = await fetch(`/api/notificaciones/marcar-leida`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificacionId: notifId })
      });

      if (res.ok) {
        setNotificaciones(notificaciones.map(notif =>
          notif.id === notifId ? { ...notif, leida: true } : notif
        ));
        onMarkAsRead?.();
      }
    } catch (error) {
      console.error("Error al marcar como leída:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    setIsMarkingAll(true);
    try {
      const res = await fetch(`/api/notificaciones/marcar-todas-leidas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId })
      });

      if (res.ok) {
        setTimeout(() => {
          setNotificaciones(notificaciones.map(notif => ({ ...notif, leida: true })));
          onMarkAsRead?.();
          setIsMarkingAll(false);
        }, 600);
      }
    } catch (error) {
      console.error("Error al marcar todas como leídas:", error);
      setIsMarkingAll(false);
    }
  };

  const notificationVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: 30 },
    transition: { duration: 0.3 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-80 max-h-[30rem] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-200"
    >
      {/* Encabezado */}
      <div className="sticky top-0 bg-white p-4 border-b border-gray-100 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BsBellFill className="text-[#8B1C62]" size={18} />
          <h2 className="text-base font-semibold text-gray-800">Notificaciones</h2>
        </div>
        <div className="flex gap-2">
          {notificaciones.some(n => !n.leida) && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAll}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
                isMarkingAll
                  ? 'bg-indigo-100 text-[#8B1C62] '
                  : 'bg-[#8B1C62] text-white hover:bg-[#8B1C62]/90'
              }`}
            >
              {isMarkingAll ? 'Procesando...' : 'Marcar todas'}
            </motion.button>
          )}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <IoClose size={20} />
          </button>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="p-2">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-8 w-8 rounded-full border-4 border-[#6B8E23] border-t-transparent"
            />
          </div>
        ) : notificaciones.length === 0 ? (
          <div className="flex flex-col items-center text-center py-12 text-gray-400">
            <BsBell size={32} />
            <p className="mt-2 text-sm font-medium">No tienes notificaciones</p>
            <p className="text-xs">Aquí aparecerán cuando algo ocurra</p>
          </div>
        ) : (
          <ul className="space-y-2">
            <AnimatePresence>
              {notificaciones.map(notif => (
                <motion.li
                  key={notif.id}
                  variants={notificationVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={notificationVariants.transition}
                  className={`p-3 rounded-xl flex items-start gap-3 transition-colors ${
                    notif.leida ? 'bg-white' : 'bg-indigo-50'
                  }`}
                >
                  <span className={`h-2 w-2 mt-1.5 rounded-full ${
                    notif.leida ? 'bg-gray-300' : 'bg-[#8B1C62] animate-pulse'
                  }`} />

                  <div className="flex-1">
                    <p className={`text-sm ${
                      notif.leida ? 'text-gray-600' : 'text-gray-900 font-medium'
                    }`}>
                      {notif.mensaje}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notif.fechaNotificacion).toLocaleString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {!notif.leida && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleMarkAsRead(notif.id)}
                      title="Marcar como leída"
                      className="text-[#6B8E23] hover:text-[#303d15] transition-colors "
                    >
                      <IoCheckmarkDone size={16} />
                    </motion.button>
                  )}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>

      {/* Footer */}
      {notificaciones.length > 0 && (
        <div className="sticky bottom-0 bg-gradient-to-t from-white via-white/90 to-transparent h-12 flex items-center justify-center text-xs text-gray-400">
          {notificaciones.length} notificaciones
        </div>
      )}
    </motion.div>
  );
}

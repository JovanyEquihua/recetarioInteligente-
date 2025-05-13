"use client";
import { useState } from "react";
import { X, Loader2, Check, Pencil } from "lucide-react";
import { toast } from "react-toastify";

export default function CambiarDetallesReceta({ receta, tiposComida, onClose, onDetallesChange }) {
  const [form, setForm] = useState({
    titulo: receta.titulo || "",
    dificultad: receta.dificultad || "Facil",
    tiempoPreparacion: receta.tiempoPreparacion || 30,
    porciones: receta.porciones || 1,
    idTipoComida: receta.tipoComida?.id || receta.idTipoComida || "",
    pasosPreparacion: Array.isArray(receta.pasosPreparacion)
      ? receta.pasosPreparacion
      : (receta.pasosPreparacion ? JSON.parse(receta.pasosPreparacion) : []),
  });
  const [nuevoPaso, setNuevoPaso] = useState({ paso: "", tiempo: "" });
  const [editPasoIdx, setEditPasoIdx] = useState(null);
  const [editPaso, setEditPaso] = useState({ paso: "", tiempo: "" });
  const [subiendo, setSubiendo] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddPaso = () => {
    if (nuevoPaso.paso) {
      setForm({
        ...form,
        pasosPreparacion: [
          ...form.pasosPreparacion,
          {
            paso: nuevoPaso.paso,
            tiempo: nuevoPaso.tiempo ? parseInt(nuevoPaso.tiempo) : null,
          },
        ],
      });
      setNuevoPaso({ paso: "", tiempo: "" });
    }
  };

  const handleRemovePaso = (idx) => {
    setForm({
      ...form,
      pasosPreparacion: form.pasosPreparacion.filter((_, i) => i !== idx),
    });
    if (editPasoIdx === idx) {
      setEditPasoIdx(null);
      setEditPaso({ paso: "", tiempo: "" });
    }
  };

  const handleEditPaso = (idx) => {
    setEditPasoIdx(idx);
    setEditPaso({
      paso: form.pasosPreparacion[idx].paso,
      tiempo: form.pasosPreparacion[idx].tiempo ?? "",
    });
  };

  const handleSaveEditPaso = (idx) => {
    setForm({
      ...form,
      pasosPreparacion: form.pasosPreparacion.map((p, i) =>
        i === idx
          ? {
              paso: editPaso.paso,
              tiempo: editPaso.tiempo ? parseInt(editPaso.tiempo) : null,
            }
          : p
      ),
    });
    setEditPasoIdx(null);
    setEditPaso({ paso: "", tiempo: "" });
  };

  const handleGuardar = async () => {
    if (!form.titulo) {
      toast.error("Por favor ingresa un nombre para la receta");
      return;
    }
    
    setSubiendo(true);
    try {
      const res = await fetch(`/api/recetas/${receta.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: form.titulo,
          dificultad: form.dificultad,
          tiempoPreparacion: parseInt(form.tiempoPreparacion),
          porciones: parseInt(form.porciones),
          idTipoComida: parseInt(form.idTipoComida),
          pasosPreparacion: form.pasosPreparacion,
        }),
      });
      if (res.ok) {
        toast.success("Receta actualizada correctamente");
        onDetallesChange && onDetallesChange(form);
        onClose();
      } else {
        toast.error("Error al actualizar la receta");
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-lg max-h-[90vh] flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-[#8B1C62] border-b pb-2">
          Editar receta
        </h2>
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          {/* Nombre de la receta */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Nombre de la receta*</label>
            <input
              type="text"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1C62] focus:border-transparent"
              placeholder="Ej: Pastel de chocolate"
              required
            />
          </div>
          
          {/* Grid de detalles básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Dificultad</label>
              <select
                name="dificultad"
                value={form.dificultad}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1C62] focus:border-transparent"
              >
                <option value="Facil">Fácil</option>
                <option value="Medio">Medio</option>
                <option value="Dificil">Difícil</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Tiempo (minutos)*</label>
              <input
                type="number"
                name="tiempoPreparacion"
                value={form.tiempoPreparacion}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1C62] focus:border-transparent"
                min="1"
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Porciones*</label>
              <input
                type="number"
                name="porciones"
                value={form.porciones}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1C62] focus:border-transparent"
                min="1"
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Tipo de comida</label>
              <select
                name="idTipoComida"
                value={form.idTipoComida}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1C62] focus:border-transparent"
              >
                <option value="">Seleccionar...</option>
                {tiposComida.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Pasos de preparación */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Pasos de preparación</label>
              <span className="text-xs text-gray-500">{form.pasosPreparacion.length} pasos</span>
            </div>
            
            <div className="space-y-3">
              {form.pasosPreparacion.map((p, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  {editPasoIdx === idx ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editPaso.paso}
                        onChange={e => setEditPaso({ ...editPaso, paso: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1C62]"
                        placeholder="Descripción del paso"
                      />
                      <input
                        type="number"
                        value={editPaso.tiempo}
                        onChange={e => setEditPaso({ ...editPaso, tiempo: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1C62]"
                        min="0"
                        placeholder="Tiempo estimado (minutos)"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditPasoIdx(null);
                            setEditPaso({ paso: "", tiempo: "" });
                          }}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleSaveEditPaso(idx)}
                          className="px-3 py-1 text-sm bg-[#8B1C62] text-white rounded hover:bg-[#6E1450]"
                        >
                          Guardar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#8B1C62]">Paso {idx + 1}</span>
                          {p.tiempo && (
                            <span className="text-xs bg-[#8B1C62]/10 text-[#8B1C62] px-2 py-1 rounded-full">
                              {p.tiempo} min
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-gray-700">{p.paso}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditPaso(idx)}
                          className="text-gray-500 hover:text-[#8B1C62] transition-colors"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleRemovePaso(idx)}
                          className="text-gray-500 hover:text-red-600 transition-colors"
                          title="Eliminar"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Agregar nuevo paso</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Descripción del paso*"
                  value={nuevoPaso.paso}
                  onChange={(e) => setNuevoPaso({ ...nuevoPaso, paso: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1C62]"
                />
                <input
                  type="number"
                  placeholder="Tiempo estimado (minutos, opcional)"
                  value={nuevoPaso.tiempo}
                  onChange={(e) => setNuevoPaso({ ...nuevoPaso, tiempo: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1C62]"
                  min="0"
                />
                <button
                  onClick={handleAddPaso}
                  disabled={!nuevoPaso.paso}
                  className="w-full px-4 py-2 bg-[#8B1C62] text-white rounded-md hover:bg-[#6E1450] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Agregar Paso
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className="mt-6 pt-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={subiendo}
            className="px-5 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={subiendo}
            className="px-5 py-2 bg-[#8B1C62] text-white rounded-lg text-sm font-medium hover:bg-[#6E1450] transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {subiendo ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Guardando...
              </>
            ) : (
              <>
                <Check size={18} />
                Guardar cambios
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
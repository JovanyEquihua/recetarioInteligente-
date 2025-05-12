"use client";
import { useState } from "react";
import { X, Loader2, Check, Pencil } from "lucide-react";
import { toast } from "react-toastify";

export default function CambiarDetallesReceta({ receta, tiposComida, onClose, onDetallesChange }) {
  const [form, setForm] = useState({
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
    // Si estabas editando este paso, cancela edición
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
    setSubiendo(true);
    try {
      const res = await fetch(`/api/recetas/${receta.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dificultad: form.dificultad,
          tiempoPreparacion: parseInt(form.tiempoPreparacion),
          porciones: parseInt(form.porciones),
          idTipoComida: parseInt(form.idTipoComida),
          pasosPreparacion: form.pasosPreparacion,
        }),
      });
      if (res.ok) {
        toast.success("Detalles actualizados");
        onDetallesChange && onDetallesChange(form);
        onClose();
      } else {
        toast.error("Error al actualizar detalles");
      }
    } catch (error) {
      toast.error("Error al actualizar detalles");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-lg h-[600px] flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
        >
          <X />
        </button>
        <h2 className="text-lg font-semibold mb-4">Editar detalles de la receta</h2>
        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Dificultad</label>
            <select
              name="dificultad"
              value={form.dificultad}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="Facil">Fácil</option>
              <option value="Medio">Medio</option>
              <option value="Dificil">Difícil</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tiempo total (minutos)</label>
            <input
              type="number"
              name="tiempoPreparacion"
              value={form.tiempoPreparacion}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Porciones</label>
            <input
              type="number"
              name="porciones"
              value={form.porciones}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de comida</label>
            <select
              name="idTipoComida"
              value={form.idTipoComida}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Seleccione un tipo de comida</option>
              {tiposComida.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>
          {/* Pasos de preparación */}
          <div>
            <label className="block text-sm font-medium mb-2">Pasos de Preparación</label>
            {form.pasosPreparacion.map((p, idx) => (
              <div key={idx} className="flex items-start gap-3 mb-2 border p-2 rounded-md">
                {editPasoIdx === idx ? (
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={editPaso.paso}
                      onChange={e => setEditPaso({ ...editPaso, paso: e.target.value })}
                      className="w-full px-2 py-1 border rounded"
                    />
                    <input
                      type="number"
                      value={editPaso.tiempo}
                      onChange={e => setEditPaso({ ...editPaso, tiempo: e.target.value })}
                      className="w-full px-2 py-1 border rounded"
                      min="0"
                      placeholder="Tiempo (min)"
                    />
                  </div>
                ) : (
                  <div className="flex-1">
                    <p className="font-semibold">Paso {idx + 1}:</p>
                    <p>{p.paso}</p>
                    {p.tiempo && (
                      <p className="text-sm text-gray-600">
                        Tiempo sugerido: {p.tiempo} min
                      </p>
                    )}
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  {editPasoIdx === idx ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSaveEditPaso(idx)}
                        className="text-green-600 hover:text-green-800"
                        title="Guardar"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditPasoIdx(null);
                          setEditPaso({ paso: "", tiempo: "" });
                        }}
                        className="text-gray-500 hover:text-gray-700"
                        title="Cancelar"
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleEditPaso(idx)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemovePaso(idx)}
                        className="text-red-500 hover:text-red-700"
                        title="Eliminar"
                      >
                        <X size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
            <div className="mt-4 space-y-2">
              <input
                type="text"
                placeholder="Descripción del paso"
                value={nuevoPaso.paso}
                onChange={(e) => setNuevoPaso({ ...nuevoPaso, paso: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="number"
                placeholder="Tiempo (opcional, en minutos)"
                value={nuevoPaso.tiempo}
                onChange={(e) => setNuevoPaso({ ...nuevoPaso, tiempo: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                min="0"
              />
              <button
                type="button"
                onClick={handleAddPaso}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Agregar Paso
              </button>
            </div>
          </div>
        </div>
        {/* Botones abajo, fuera del scroll */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded text-gray-700"
            disabled={subiendo}
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={subiendo}
            className="px-4 py-2 bg-[#8B1C62] text-white rounded text-sm flex items-center gap-2 disabled:opacity-50"
          >
            {subiendo ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
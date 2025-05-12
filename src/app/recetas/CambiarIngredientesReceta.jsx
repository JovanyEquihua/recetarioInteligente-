"use client";
import { useState } from "react";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const TIPOS = [
  "Verduras",
  "Frutas",
  "Cereales",
  "Alimentos_de_origen_animal",
  "Leguminosas",
];

export default function CambiarIngredientesReceta({ receta, onClose, onIngredientesChange }) {
  // Mapea los ingredientes actuales a la estructura deseada
  const [ingredientes, setIngredientes] = useState(
    receta.ingredientes?.map(i => ({
      id: i.id,
      nombre: i.ingrediente?.nombre || i.nombre || "",
      cantidad: i.cantidad || "",
      tipo: i.ingrediente?.Tipo || i.tipo || TIPOS[0],
    })) || []
  );
  const [subiendo, setSubiendo] = useState(false);

  const handleIngredienteChange = (idx, field, value) => {
    setIngredientes(prev =>
      prev.map((ing, i) => (i === idx ? { ...ing, [field]: value } : ing))
    );
  };

  const handleAddIngrediente = () => {
    setIngredientes(prev => [...prev, { nombre: "", cantidad: "", tipo: TIPOS[0] }]);
  };

  const handleRemoveIngrediente = (idx) => {
    setIngredientes(prev => prev.filter((_, i) => i !== idx));
  };

  const handleGuardar = async () => {
    setSubiendo(true);
    try {
      const res = await fetch(`/api/recetas/${receta.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredientes }),
      });
      if (res.ok) {
        toast.success("Ingredientes actualizados");
        onIngredientesChange(ingredientes);
        onClose();
      } else {
        toast.error("Error al actualizar ingredientes");
      }
    } catch (error) {
      toast.error("Error al actualizar ingredientes");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
        >
          <X />
        </button>
        <h2 className="text-lg font-semibold mb-4">Editar ingredientes</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {ingredientes.map((ing, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                className="border rounded px-2 py-1 w-1/3"
                placeholder="Ingrediente"
                value={ing.nombre}
                onChange={e => handleIngredienteChange(idx, "nombre", e.target.value)}
              />
              <input
                className="border rounded px-2 py-1 w-1/4"
                placeholder="Cantidad"
                value={ing.cantidad}
                onChange={e => handleIngredienteChange(idx, "cantidad", e.target.value)}
              />
              <select
                className="border rounded px-2 py-1 w-1/3"
                value={ing.tipo}
                onChange={e => handleIngredienteChange(idx, "tipo", e.target.value)}
              >
                {TIPOS.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo.replace(/_/g, " ")}</option>
                ))}
              </select>
              <button
                onClick={() => handleRemoveIngrediente(idx)}
                className="text-red-500 hover:bg-gray-100 rounded-full p-1"
                title="Eliminar"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={handleAddIngrediente}
          className="mt-4 flex items-center gap-1 text-sm text-blue-600 hover:underline"
        >
          <Plus size={18} /> Agregar ingrediente
        </button>
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
            {subiendo && <Loader2 className="animate-spin" size={18} />}
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
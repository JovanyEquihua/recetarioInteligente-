"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { X, Upload, Check, Trash2, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CambiarImagenReceta({
  receta,
  onClose,
  onImageChange,
}) {
  const [nuevaImagen, setNuevaImagen] = useState(
  receta.imagen && receta.imagen.trim() !== "" ? receta.imagen : "/placeholder-food.jpg"
);
  const [subiendo, setSubiendo] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.match("image.*")) {
      toast.error("Por favor, selecciona un archivo de imagen");
      return;
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no debe superar los 5MB");
      return;
    }

    setSubiendo(true);

    try {
      // Mostrar vista previa mientras se sube
      const reader = new FileReader();
      reader.onload = (e) => {
        setNuevaImagen(e.target.result);
      };
      reader.readAsDataURL(file);

      // Subir a Cloudinary
      const res = await fetch("/api/cloudinary/sign");
      const { timestamp, signature, apiKey, cloudName } = await res.json();

      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("api_key", apiKey);
      uploadData.append("timestamp", timestamp);
      uploadData.append("signature", signature);
      uploadData.append("folder", "perfil");

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: uploadData }
      );

      const data = await cloudinaryRes.json();
      setNuevaImagen(data.secure_url);
      toast.success("Imagen subida correctamente");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Error al subir la imagen");
      setNuevaImagen(receta.imagen && receta.imagen.trim() !== "" ? receta.imagen : "/placeholder-food.jpg");

    } finally {
      setSubiendo(false);
    }
  };

  const handleRemoveImage = () => {
    setNuevaImagen("/placeholder-food.jpg");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.info("Imagen restablecida");
  };

  const handleGuardar = async () => {
    if (nuevaImagen === receta.imagen) {
      onClose();
      return;
    }

    setSubiendo(true);
    try {
      const res = await fetch(`/api/recetas/${receta.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagen: nuevaImagen }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      onImageChange(nuevaImagen);
      toast.success("Imagen actualizada correctamente");
      onClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Error al guardar la imagen");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8B1C62] to-[#BF1E6A] p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Cambiar imagen de receta
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
            disabled={subiendo}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Vista previa */}
          <div className="relative group mb-4">
            <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
              {nuevaImagen && (
                <Image
                  src={nuevaImagen}
                  alt="Imagen de la receta"
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>
            {nuevaImagen !== "/placeholder-food.jpg" && (
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 p-1.5 rounded-full shadow-md transition-all hover:scale-110"
                disabled={subiendo}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Controles */}
          <div className="space-y-4">
            <label className="block">
              <span className="sr-only">Seleccionar imagen</span>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
                  disabled={subiendo}
                >
                  <Upload className="w-4 h-4" />
                  {nuevaImagen === "/placeholder-food.jpg"
                    ? "Seleccionar imagen"
                    : "Cambiar imagen"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={subiendo}
                />
              </div>
            </label>

            {subiendo && (
              <div className="flex items-center justify-center gap-2 text-blue-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>
                  {nuevaImagen.startsWith("data:")
                    ? "Procesando imagen..."
                    : "Guardando cambios..."}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md border border-gray-300 transition-colors"
            disabled={subiendo}
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={subiendo || nuevaImagen === receta.imagen}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
              subiendo || nuevaImagen === receta.imagen
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#8B1C62] hover:bg-[#7a1755]"
            }`}
          >
            {subiendo ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Guardar cambios
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { X, Upload, User, Mail, PenLine, Check, Info, Trash } from "lucide-react";

export default function EditarPerfil({ user, onSave, onClose }) {
  const { update } = useSession();
  const [formData, setFormData] = useState({
    nombre: user.nombre || "",
    apellidoP: user.apellidoP || "",
    apellidoM: user.apellidoM || "",
    email: user.email || "",
    nombreUsuario: user.nombreUsuario || "",
    fotoPerfil: user.fotoPerfil || "/default-profile.png", // Foto por defecto
    titulo: user.titulo || "",
    biografia: user.biografia || "",
  });

  const [subiendo, setSubiendo] = useState(false);
  const [exito, setExito] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSubiendo(true);

    try {
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
      setFormData({ ...formData, fotoPerfil: data.secure_url });
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    } finally {
      setSubiendo(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, fotoPerfil: "/images/foto-de-perfil.png" }); // Restablece la foto por defecto
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/usuario/editar", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Error al guardar los cambios");

      await update({
        ...formData,
        image: formData.fotoPerfil,
        name: `${formData.nombre} ${formData.apellidoP}`.trim(),
      });

      setExito(true);
      setTimeout(() => {
        onSave(formData);
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <User className="text-black" size={18} />
            Editar perfil
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transform transition-transform hover:rotate-90"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Foto de perfil */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-24 h-24 mb-2 group">
              <Image
                src={formData.fotoPerfil || "/images/foto-de-perfil.png"}
                alt="Foto de perfil"
                fill
                className="rounded-full object-cover border-2 border-gray-200"
              />
              <label
                className="absolute -bottom-2 right-0 bg-white p-1 rounded-full shadow-sm border border-gray-200 cursor-pointer group-hover:scale-105 transition-transform"
                title="Cambiar imagen"
              >
                <Upload size={16} className="text-gray-600" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            {/* Botón para borrar la foto */}
            <button
              type="button"
              onClick={handleRemoveImage}
              className="mt-2 flex items-center gap-2 text-sm text-red-500 hover:text-red-700"
            >
              <Trash size={16} />
              Borrar foto
            </button>

            {subiendo && (
              <p className="text-xs text-gray-500 mt-1">Subiendo imagen...</p>
            )}
          </div>

          {/* Sección: Datos personales */}
          <div className="mb-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-black mb-1">
              <User size={16} /> Información personal
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                className="col-span-1 px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-[#8B1C62] focus:border-[#8B1C62]"
              />
              <input
                type="text"
                name="apellidoP"
                value={formData.apellidoP}
                onChange={handleChange}
                placeholder="Apellido Paterno"
                className="col-span-1 px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-[#8B1C62] focus:border-[#8B1C62]"
              />
              <input
                type="text"
                name="apellidoM"
                value={formData.apellidoM}
                onChange={handleChange}
                placeholder="Apellido Materno"
                className="col-span-2 px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-[#8B1C62] focus:border-[#8B1C62]"
              />
            </div>
          </div>

          {/* Separador */}
          <hr className="my-4 border-gray-200" />

          {/* Sección: Usuario */}
          <div className="mb-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-black mb-2">
              <PenLine size={16} /> Información de cuenta
            </h3>
            <input
              type="text"
              name="nombreUsuario"
              value={formData.nombreUsuario}
              onChange={handleChange}
              placeholder="Usuario"
              className="w-full px-3 py-2 border rounded-md text-sm mb-3 focus:ring-2 focus:ring-[#8B1C62] focus:border-[#8B1C62]"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full px-3 py-2 border rounded-md text-sm text-gray-400 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Separador */}
          <hr className="my-4 border-gray-200" />

          {/* Sección: Profesional */}
          <div className="mb-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-black mb-2">
              <Info size={16} /> Información adicional
            </h3>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Descripción"
              className="w-full px-3 py-2 border rounded-md text-sm mb-3 focus:ring-2 focus:ring-[#8B1C62] focus:border-[#8B1C62]"
            />
            <textarea
              name="biografia"
              value={formData.biografia}
              onChange={handleChange}
              placeholder="Biografía"
              rows="3"
              className="w-full px-3 py-2 border rounded-md text-sm resize-none focus:ring-2 focus:ring-[#8B1C62] focus:border-[#8B1C62]"
            />
          </div>

          {/* Éxito */}
          {exito && (
            <div className="mt-4 p-2 bg-green-50 text-green-700 text-sm rounded text-center">
              <Check size={16} className="inline mr-1" />
              ¡Cambios guardados correctamente!
            </div>
          )}

          {/* Botones */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md border border-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={subiendo}
              className="px-4 py-2 bg-[#8B1C62] text-white text-sm font-medium rounded-md hover:bg-[#7a1755] disabled:opacity-50 flex items-center"
            >
              {subiendo ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Guardando...
                </>
              ) : (
                "Guardar cambios"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
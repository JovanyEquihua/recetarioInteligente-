"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  Upload,
  X,
  Check,
  PlusCircle,
  Clock,
  Utensils,
  Trash,
} from "lucide-react";

export default function CrearReceta({ onSave }) {
  const { data: session } = useSession();
  const [tiposComida, setTiposComida] = useState([]);
  const [tiposSabor, setTiposSabor] = useState([]);
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    tiempoPreparacion: 30,
    dificultad: "Facil",
    porciones: 2,
    ingredientes: [],
    pasosPreparacion: [], // Cambiado a un array para pasos de preparació // Esto podría ser parte de la descripción
    imagen: "/images/default-recipe.png",
    idTipoComida: 1, // Valor por defecto
    idTipoSabor: 1, // Valor por defecto
  });

  const [nuevoIngrediente, setNuevoIngrediente] = useState({
    nombre: "",
    cantidad: "",
  });
  const [subiendo, setSubiendo] = useState(false);
  const [exito, setExito] = useState(false);
  const [nuevoPaso, setNuevoPaso] = useState({ paso: "", tiempo: "" });


  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const res = await fetch("/api/recetas/tipos");
        if (!res.ok) throw new Error("Error al obtener tipos");
        const data = await res.json();
        setTiposComida(data.tiposComida);
        setTiposSabor(data.tiposSabor);
      } catch (error) {
        console.error("Error al obtener tipos:", error);
      }
    };
  
    fetchTipos();
  }, []);
  // Función para subir imagen a Cloudinary (igual que en EditarPerfil)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSubiendo(true);

    try {
      // 1. Obtener la firma de Cloudinary
      const res = await fetch("/api/cloudinary/sign");
      if (!res.ok) throw new Error("Error al obtener firma de Cloudinary");

      const { timestamp, signature, apiKey, cloudName } = await res.json();

      // 2. Preparar datos para subir
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("api_key", apiKey);
      uploadData.append("timestamp", timestamp);
      uploadData.append("signature", signature);
      uploadData.append("folder", "perfil"); // Cambiado a carpeta recetas

      // 3. Subir imagen a Cloudinary
      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: uploadData }
      );

      if (!cloudinaryRes.ok) throw new Error("Error al subir imagen");

      const data = await cloudinaryRes.json();
      setFormData({ ...formData, imagen: data.secure_url });
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      alert("Error al subir la imagen: " + error.message);
    } finally {
      setSubiendo(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, imagen: "/images/default-recipe.png" });
  };

  const agregarIngrediente = () => {
    if (nuevoIngrediente.nombre && nuevoIngrediente.cantidad) {
      setFormData({
        ...formData,
        ingredientes: [...formData.ingredientes, nuevoIngrediente],
      });
      setNuevoIngrediente({ nombre: "", cantidad: "" });
    }
  };

  const eliminarIngrediente = (index) => {
    const nuevosIngredientes = formData.ingredientes.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, ingredientes: nuevosIngredientes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session?.user?.id) {
      alert("No se pudo obtener el usuario autenticado.");
      return;
    }

    const formDataConValoresConvertidos = {
      ...formData,
      usuarioId: session.user.id, // Asegúrate de que el ID del usuario esté disponible
      tiempoPreparacion: parseInt(formData.tiempoPreparacion, 10), // Convertir a entero
      porciones: parseInt(formData.porciones, 10),
      pasosPreparacion: formData.pasosPreparacion,
      idTipoComida: formData.idTipoComida,
      idTipoSabor: formData.idTipoSabor, // Convertir a entero
    };

    console.log("Datos enviados:", formDataConValoresConvertidos); // Verifica los datos antes de enviarlos

    try {
      const res = await fetch("/api/recetas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataConValoresConvertidos),
      });

      if (!res.ok) {
        const errorText = await res.text(); // Captura el error como texto
        throw new Error(errorText);
      }

      const data = await res.json();
      console.log("Receta creada:", data);
      setExito(true);
      setTimeout(() => {
        onSave?.();
        setFormData({
          titulo: "",
          descripcion: "",
          tiempoPreparacion: 30,
          dificultad: "Facil",
          porciones: 2,
          imagen: "/images/default-recipe.png",
       
    
          ingredientes: [],
        });
      }, 1500);
    } catch (error) {
      console.error("Error al guardar la receta:", error);
      alert("Error al guardar: " + error.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <PlusCircle size={24} /> Crear Nueva Receta
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sección de Imagen */}
        <div className="flex flex-col items-start">
          <label className="block text-sm font-medium mb-2">
            Imagen de la Receta
          </label>
          <div className="relative w-full h-64 group">
            <Image
              src={formData.imagen}
              alt="Imagen de la receta"
              fill
              className="rounded-lg object-cover border-2 border-gray-200"
            />
            <label className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition">
              <Upload size={20} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            {formData.imagen !== "/images/default-recipe.png" && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute bottom-4 left-4 bg-white p-2 rounded-full shadow-md text-red-500 hover:bg-red-50 transition"
              >
                <Trash size={20} />
              </button>
            )}
          </div>
          {subiendo && (
            <p className="mt-2 text-sm text-blue-600">
              Subiendo imagen, por favor espere...
            </p>
          )}
        </div>

        {/* Información Básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título*</label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) =>
                setFormData({ ...formData, titulo: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Tiempo (minutos)*
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={formData.tiempoPreparacion}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tiempoPreparacion: e.target.value,
                  })
                }
                className="w-full pl-10 pr-3 py-2 border rounded-md"
                min="1"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Dificultad*
            </label>
            <select
              value={formData.dificultad}
              onChange={(e) =>
                setFormData({ ...formData, dificultad: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="Facil">Fácil</option>
              <option value="Medio">Medio</option>
              <option value="Dificil">Difícil</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Tipo de Comida*
            </label>
            <select
              value={formData.idTipoComida}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  idTipoComida: parseInt(e.target.value, 10),
                })
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Seleccione un tipo de comida</option>
              {tiposComida.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Tipo de Sabor*
            </label>
            <select
              value={formData.idTipoSabor}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  idTipoSabor: parseInt(e.target.value, 10),
                })
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Seleccione un tipo de sabor</option>
              {tiposSabor.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombreSabor}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Porciones*</label>
            <div className="relative">
              <Utensils className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={formData.porciones}
                onChange={(e) =>
                  setFormData({ ...formData, porciones: e.target.value })
                }
                className="w-full pl-10 pr-3 py-2 border rounded-md"
                min="1"
                required
              />
            </div>
          </div>
        </div>

       

        {/* Ingredientes */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Ingredientes*
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Nombre (ej: Zanahoria)"
              value={nuevoIngrediente.nombre}
              onChange={(e) =>
                setNuevoIngrediente({
                  ...nuevoIngrediente,
                  nombre: e.target.value,
                })
              }
              className="flex-1 px-3 py-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Cantidad (ej: 2 tazas)"
              value={nuevoIngrediente.cantidad}
              onChange={(e) =>
                setNuevoIngrediente({
                  ...nuevoIngrediente,
                  cantidad: e.target.value,
                })
              }
              className="w-32 px-3 py-2 border rounded-md"
            />
            <button
              type="button"
              onClick={agregarIngrediente}
              className="px-4 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Agregar
            </button>

            <select
              value={nuevoIngrediente.tipo}
              onChange={(e) =>
                setNuevoIngrediente({
                  ...nuevoIngrediente,
                  tipo: e.target.value,
                })
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="Verduras">Verduras</option>
              <option value="Frutas">Frutas</option>
              <option value="Cereales">Cereales</option>
              <option value="Alimentos_de_origen_animal">
                Alimentos de origen animal
              </option>
              <option value="Leguminosas">Leguminosas</option>
            </select>
          </div>

          <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
            {formData.ingredientes.length === 0 ? (
              <p className="text-sm text-gray-500">
                No hay ingredientes añadidos
              </p>
            ) : (
              <ul className="space-y-2">
                {formData.ingredientes.map((ing, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-50 p-2 rounded"
                  >
                    <span className="text-sm">
                      <span className="font-medium">{ing.nombre}</span> -{" "}
                      {ing.cantidad}
                    </span>
                    <button
                      type="button"
                      onClick={() => eliminarIngrediente(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
{/* Pasos de Preparación */}
        <div>
  <label className="block text-sm font-medium mb-2">
    Pasos de Preparación
  </label>

  {formData.pasosPreparacion.map((p, idx) => (
    <div
      key={idx}
      className="flex items-start gap-3 mb-2 border p-2 rounded-md"
    >
      <div className="flex-1">
        <p className="font-semibold">Paso {idx + 1}:</p>
        <p>{p.paso}</p>
        {p.tiempo && (
          <p className="text-sm text-gray-600">
            Tiempo sugerido: {p.tiempo} min
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() =>
          setFormData({
            ...formData,
            pasosPreparacion: formData.pasosPreparacion.filter((_, i) => i !== idx),
          })
        }
        className="text-red-500 hover:text-red-700"
      >
        <Trash size={18} />
      </button>
    </div>
  ))}

  <div className="mt-4 space-y-2">
    <input
      type="text"
      placeholder="Descripción del paso"
      value={nuevoPaso.paso}
      onChange={(e) =>
        setNuevoPaso({ ...nuevoPaso, paso: e.target.value })
      }
      className="w-full px-3 py-2 border rounded-md"
    />
    <input
      type="number"
      placeholder="Tiempo (opcional, en minutos)"
      value={nuevoPaso.tiempo}
      onChange={(e) =>
        setNuevoPaso({ ...nuevoPaso, tiempo: e.target.value })
      }
      className="w-full px-3 py-2 border rounded-md"
      min="0"
    />
    <button
      type="button"
      onClick={() => {
        if (nuevoPaso.paso) {
          setFormData({
            ...formData,
            pasosPreparacion: [...formData.pasosPreparacion, {
              paso: nuevoPaso.paso,
              tiempo: nuevoPaso.tiempo ? parseInt(nuevoPaso.tiempo) : null,
            }],
          });
          setNuevoPaso({ paso: "", tiempo: "" });
        }
      }}
      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
    >
      Agregar Paso
    </button>
  </div>
</div>


        {/* Mensaje de éxito */}
        {exito && (
          <div className="p-3 bg-green-50 text-green-700 rounded-md text-center">
            <Check className="inline mr-2" /> ¡Receta creada exitosamente!
          </div>
        )}

        {/* Botón de enviar */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={subiendo}
            className="px-6 py-2 bg-[#8B1C62] text-white rounded-md hover:bg-[#7a1755] disabled:opacity-50 flex items-center"
          >
            {subiendo ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Guardando...
              </>
            ) : (
              "Guardar Receta"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

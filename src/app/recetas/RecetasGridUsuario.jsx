"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Trash2, Pencil, ImageIcon, List, Settings } from "lucide-react";
import { useState, Fragment } from "react";
import { Popover } from "@headlessui/react";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CambiarImagenReceta from "./CambiarImagenReceta";
import CambiarIngredientesReceta from "./CambiarIngredientesReceta";
import CambiarDetallesReceta from "./CambiarDetallesReceta";

const abrirEditarImagen = (receta) => {
  setRecetaSeleccionada(receta);
  setIsEditarImagenOpen(true);
};

const cerrarEditarImagen = () => {
  setRecetaSeleccionada(null);
  setIsEditarImagenOpen(false);
};

export default function RecetasGridUsuario({ recetas }) {
  const { data: session } = useSession();
  const [listaRecetas, setListaRecetas] = useState(recetas);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recetaToDelete, setRecetaToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditarImagenOpen, setIsEditarImagenOpen] = useState(false);
  const [isEditarIngredientesOpen, setIsEditarIngredientesOpen] =
    useState(false);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);
  const [isEditarDetallesOpen, setIsEditarDetallesOpen] = useState(false);
  const [tiposComida, setTiposComida] = useState([]);

  const abrirEditarImagen = (receta) => {
    setRecetaSeleccionada(receta);
    setIsEditarImagenOpen(true);
  };

  const cerrarEditarImagen = () => {
    setRecetaSeleccionada(null);
    setIsEditarImagenOpen(false);
  };

  const abrirEditarIngredientes = async (receta) => {
    // Opcional: muestra un loader aquí si quieres
    try {
      const res = await fetch(`/api/recetas/${receta.id}`);
      if (res.ok) {
        const recetaActualizada = await res.json();
        setRecetaSeleccionada(recetaActualizada);
        setIsEditarIngredientesOpen(true);
      } else {
        toast.error("No se pudo obtener la receta actualizada");
      }
    } catch (error) {
      toast.error("Error al obtener la receta");
    }
  };

  const handleImagenCambiada = (nuevaImagen) => {
    setListaRecetas((prev) =>
      prev.map((r) =>
        r.id === recetaSeleccionada.id ? { ...r, imagen: nuevaImagen } : r
      )
    );
  };

  const openDeleteModal = (id) => {
    setRecetaToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setRecetaToDelete(null);
  };

  const cerrarEditarIngredientes = () => {
    setRecetaSeleccionada(null);
    setIsEditarIngredientesOpen(false);
  };

  const handleIngredientesCambiados = (nuevosIngredientes) => {
    setListaRecetas((prev) =>
      prev.map((r) =>
        r.id === recetaSeleccionada.id
          ? { ...r, ingredientes: nuevosIngredientes }
          : r
      )
    );
    // Actualiza también la receta seleccionada si el pop-up sigue abierto
    setRecetaSeleccionada((prev) =>
      prev ? { ...prev, ingredientes: nuevosIngredientes } : prev
    );
  };
  const handleDelete = async () => {
    if (!recetaToDelete) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/recetas/${recetaToDelete}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al eliminar receta");
      }

      setListaRecetas((prev) => prev.filter((r) => r.id !== recetaToDelete));
      toast.success(result.message || "Receta eliminada correctamente");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Error al eliminar la receta");
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  };
  const abrirEditarDetalles = async (receta) => {
    try {
      // Opcional: puedes mostrar un loader aquí
      const res = await fetch(`/api/recetas/${receta.id}`);
      if (res.ok) {
        const recetaActualizada = await res.json();
        setRecetaSeleccionada(recetaActualizada);
        // Si no tienes los tipos de comida cargados, haz fetch aquí
        if (tiposComida.length === 0) {
          const resTipos = await fetch("/api/tiposComida");
          if (resTipos.ok) {
            setTiposComida(await resTipos.json());
          }
        }
        setIsEditarDetallesOpen(true);
      } else {
        toast.error("No se pudo obtener la receta actualizada");
      }
    } catch (error) {
      toast.error("Error al obtener la receta");
    }
  };
  const cerrarEditarDetalles = () => {
    setRecetaSeleccionada(null);
    setIsEditarDetallesOpen(false);
  };
  const handleDetallesCambiados = (nuevosDetalles) => {
    setListaRecetas((prev) =>
      prev.map((r) =>
        r.id === recetaSeleccionada.id ? { ...r, ...nuevosDetalles } : r
      )
    );
    setRecetaSeleccionada((prev) =>
      prev ? { ...prev, ...nuevosDetalles } : prev
    );
  };

  return (
    <div className="relative">
      {/* Modal de Confirmación */}
      <Transition appear show={isDeleteModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeDeleteModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Confirmar eliminación
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      ¿Estás seguro de eliminar esta receta? Esta acción no se
                      puede deshacer.
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none"
                      onClick={closeDeleteModal}
                      disabled={isDeleting}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Eliminando..." : "Eliminar"}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {isEditarImagenOpen && recetaSeleccionada && (
        <CambiarImagenReceta
          receta={recetaSeleccionada}
          onClose={cerrarEditarImagen}
          onImageChange={handleImagenCambiada}
        />
      )}
      {isEditarIngredientesOpen && recetaSeleccionada && (
        <CambiarIngredientesReceta
          receta={recetaSeleccionada}
          onClose={cerrarEditarIngredientes}
          onIngredientesChange={handleIngredientesCambiados}
        />
      )}
      {isEditarDetallesOpen && recetaSeleccionada && (
        <CambiarDetallesReceta
          receta={recetaSeleccionada}
          tiposComida={tiposComida}
          onClose={cerrarEditarDetalles}
          onDetallesChange={handleDetallesCambiados}
        />
      )}
      {/* Grid de Recetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listaRecetas.map((receta) => (
          <div
            key={receta.id}
            className="relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
          >
            {session?.user?.id === receta.usuarioId && (
              <div className="absolute top-2 right-2 flex gap-2 z-10">
                {/* Popover de Edición */}
                <Popover className="relative">
                  <Popover.Button className="bg-white p-1 rounded-full shadow hover:bg-gray-100 transition-transform hover:scale-110">
                    <Pencil className="w-4 h-4 text-blue-600" />
                  </Popover.Button>

                  <Popover.Panel className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <button
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => abrirEditarDetalles(receta)}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Editar detalles
                    </button>
                    <button
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => abrirEditarImagen(receta)}
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Cambiar imagen
                    </button>
                    <button
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => abrirEditarIngredientes(receta)}
                    >
                      <List className="w-4 h-4 mr-2" />
                      Ingredientes
                    </button>
                    
                  </Popover.Panel>
                </Popover>

                <button
                  onClick={() => openDeleteModal(receta.id)}
                  className="bg-white p-1 rounded-full shadow hover:bg-gray-100 transition-transform hover:scale-110"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            )}

            <Link href={`/usuario/recetas/${receta.id}`}>
              <div className="relative">
                <img
                  src={receta.imagen || "/placeholder-food.jpg"}
                  alt={receta.titulo}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white font-semibold text-lg">
                    {receta.titulo}
                  </h3>
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>⏱ {receta.tiempoPreparacion} min</span>
                  <span>🍽️ {receta.porciones} porciones</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="bg-[#f0e6ed] text-[#8B1C62] px-2 py-1 rounded-full text-xs">
                    {receta.dificultad}
                  </span>
                  {receta.tipoComida && (
                    <span className="bg-[#e6f0ed] text-[#6B8E23] px-2 py-1 rounded-full text-xs">
                      {receta.tipoComida}
                    </span>
                  )}
                </div>

                <p className="text-gray-500 text-xs">
                  Publicada:{" "}
                  {new Date(receta.fechaCreacion).toLocaleDateString("es-MX")}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

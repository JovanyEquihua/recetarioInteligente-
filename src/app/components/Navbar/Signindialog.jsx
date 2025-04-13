"use client";

import { useState, Fragment } from "react";
import { signIn } from "next-auth/react";
import { Dialog, Transition } from "@headlessui/react";
import { FcGoogle } from "react-icons/fc";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CookingLoader from "../Animaciones/CookingLoader"; // Asegúrate de que la ruta sea correcta

const LoginModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Estado para el loader
  const router = useRouter(); // Inicializa router

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Activa el loader

    const result = await signIn("credentials", {
      redirect: false,
      email,
      contraseña,
    });

    if (result.error) {
      setError("Usuario y/o contraseña incorrectos.");
      setEmail(""); // Limpia el input de correo
      setContraseña(""); // Limpia el input de contraseña
      setIsLoading(false); // Desactiva el loader si hay un error
      return;
    }

    const res = await fetch("/api/auth/session");
    const session = await res.json();

    setIsLoading(false); // Desactiva el loader después de la autenticación

    if (session.user.rol === "ADMIN") {
      closeModal(); // Cierra el modal si el inicio de sesión es exitoso
      router.push("/admin"); // Página de administrador
      setEmail(""); 
      setContraseña(""); 
    } else {
      closeModal(); // Cierra el modal si el inicio de sesión es exitoso
      router.push("/usuario"); // Página de usuario
      setEmail(""); 
      setContraseña(""); 
    }
  };

  return (
    <>
      <button
        className="px-5 py-2 font-semibold text-white bg-[#8B1C62] rounded-full shadow-md hover:scale-105 transition-transform"
        onClick={openModal}
      >
        Iniciar Sesión
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-md" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl transform transition-all relative">
                <button
                  className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition-transform transform hover:rotate-90"
                  onClick={closeModal}
                >
                  <IoClose size={24} />
                </button>
                <div className="flex flex-col items-center">
                  <Image
                    src="/images/Logo/logo.png"
                    alt="logo"
                    width={200}
                    height={200}
                  />
                  <h2 className="mt-3 text-2xl font-bold text-gray-800">
                    Bienvenido
                  </h2>
                  <p className="text-sm text-gray-500">
                    Ingresa tus credenciales para continuar
                  </p>
                </div>

                {error && (
                  <p className="mt-3 text-red-500 text-center">{error}</p>
                )}

                {isLoading ? (
                  // Mostrar el loader mientras se procesa la autenticación
                  <CookingLoader />
                ) : (
                  // Mostrar el formulario si no está cargando
                  <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#] outline-none"
                      placeholder="Correo electrónico"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                      type="password"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] outline-none"
                      placeholder="Contraseña"
                      required
                      value={contraseña}
                      onChange={(e) => setContraseña(e.target.value)}
                    />
                    <Link
                      href="/restablecer-contrasena"
                      className="text-indigo-500 hover:underline"
                    >
                      <p
                        className="mt-4 text-sm text-center text-gray-600 "
                        onClick={closeModal}
                      >
                        ¿Has olvidado tu contraseña?{" "}
                      </p>
                    </Link>
                    <button
                      type="submit"
                      className="w-full px-4 py-2 font-semibold mt-4 rounded-lg  text-white  space-y-3 bg-[#8B1C62] hover:scale-105  hover:bg-[#A44572] transition-transform shadow-md"
                    >
                      Iniciar sesión
                    </button>
                  </form>
                )}

                <button
                  className="w-full flex items-center justify-center mt-4 px-4 py-2 font-semibold  bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition duration-300"
                  onClick={() => signIn("google")}
                >
                  <FcGoogle className="mr-2 text-xl" /> Iniciar sesión con
                  Google
                </button>

                <p
                  className="mt-4 text-sm text-center text-gray-600"
                  onClick={closeModal}
                >
                  ¿No tienes cuenta?{" "}
                  <Link
                    href="/registrarse"
                    className="text-indigo-500 hover:underline"
                  >
                    Regístrate
                  </Link>
                </p>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default LoginModal;
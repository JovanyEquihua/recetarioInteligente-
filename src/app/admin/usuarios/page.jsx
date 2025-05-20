"use client";
import {useEffect, useState} from "react";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await fetch("/api/usuarios"); // Asegúrate de que esta ruta exista en tu backend
        const data = await res.json();

        if (Array.isArray(data)) {
          setUsuarios(data);
        } else {
          console.error("Formato de datos inesperado:", data);
          setUsuarios([]);
        }
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
      }
    };

    fetchUsuarios();
  }, []);

    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>
        <p>Administra las cuentas de los usuarios registrados en la plataforma.</p>

        {usuarios.length > 0 ? (
        <table className="min-w-full border border-gray-300 text-sm">
          <thead>
            <tr>
              <th className="border px-4 py-2">Nombre</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Fecha de Registro</th>
              <th className="border px-4 py-2">Rol</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">
                  {`${usuario.nombre} ${usuario.apellidoP} ${usuario.apellidoM}`}
                </td>
                <td className="border px-4 py-2">{usuario.email}</td>
                <td className="border px-4 py-2">{usuario.fechaRegistro?.split("T")[0]}</td>
                <td className="border px-4 py-2">{usuario.rol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay usuarios registrados.</p>
      )}
      </div>
    );
  }
  
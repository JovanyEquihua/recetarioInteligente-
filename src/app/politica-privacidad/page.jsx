"use client";

import Link from "next/link";

export default function PoliticaPrivacidad() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-[#2D2D2D]">
      <h1 className="text-3xl font-bold mb-6 text-[#8B1C62]">Política de Privacidad</h1>

      <p className="mb-4">
        En <strong>ChefPick</strong>, valoramos tu privacidad y nos comprometemos a proteger la información
        personal que compartes con nosotros. Esta política explica cómo recopilamos,
        usamos y protegemos tus datos.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1. Información que recopilamos</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Información de contacto (como nombre, correo electrónico).</li>
        <li>Preferencias alimenticias y datos de uso.</li>
        <li>Información del dispositivo y navegación.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">2. Uso de la información</h2>
      <p className="mb-4">
        Utilizamos tu información para personalizar recetas, mejorar nuestros servicios y
        enviarte notificaciones relevantes. Nunca compartiremos tus datos con terceros sin tu consentimiento.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">3. Cookies</h2>
      <p className="mb-4">
        Usamos cookies para mejorar tu experiencia de navegación. Puedes modificar tus
        preferencias en cualquier momento desde la configuración de tu navegador.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">4. Seguridad</h2>
      <p className="mb-4">
        Implementamos medidas de seguridad para proteger tu información, pero recuerda
        que ningún sistema es 100% seguro.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">5. Contacto</h2>
      <p className="mb-4">
        Si tienes preguntas sobre esta política, escríbenos a
        <a href="mailto:soporte@chefpick.com" className="text-[#8B1C62] ml-1 underline">soporte@chefpick.com</a>.
      </p>

      <p className="text-sm text-gray-500 mt-8">
        Última actualización: Mayo 2025
      </p>

      <div className="mt-10">
        <Link href="/terminos" className="text-sm underline text-[#8B1C62] mr-4">Términos y condiciones</Link>
        <Link href="/cookies" className="text-sm underline text-[#8B1C62]">Política de cookies</Link>
      </div>
    </main>
  );
}

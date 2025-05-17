export default function PasosSection({ pasosPreparacion }) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-[#8B1C62] mb-4">
          Pasos para preparar
        </h2>
        <ul className="space-y-5">
          {Array.isArray(pasosPreparacion) && pasosPreparacion.length > 0 ? (
            pasosPreparacion.map((paso, index) => (
              <li
                key={index}
                className="bg-gradient-to-b from-[#faf5f9] to-[#f3e6f0] p-5 rounded-xl shadow-md"
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center justify-center w-10 h-10 bg-[#8B1C62] text-white rounded-full font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-black">
                    Paso {index + 1}
                  </h3>
                </div>
                <p className="ml-14 text-gray-800">{paso.paso}</p>
                <p className="ml-14 text-sm mt-2 text-gray-600">
                  {paso.tiempo ? (
                    `⏱️ Tiempo: ${paso.tiempo} minutos`
                  ) : (
                    <span className="italic">Sin tiempo estimado</span>
                  )}
                </p>
              </li>
            ))
          ) : (
            <p className="text-gray-500">
              No se proporcionaron pasos de preparación.
            </p>
          )}
        </ul>
      </div>
    );
  }
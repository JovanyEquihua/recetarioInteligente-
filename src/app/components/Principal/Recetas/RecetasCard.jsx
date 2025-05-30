import Image from "next/image";
import { Fade } from "react-awesome-reveal";
import { GiStarsStack } from "react-icons/gi";
import Link from "next/link";

export default function RecetasDestacadas({ recetas, usuarioId }) {
  return (
    <div className="relative mx-auto max-w-7xl py-12 px-6 ">
      <div className="text-center mb-14 ">
        <Fade direction="up" delay={400} cascade damping={0.1} triggerOnce>
          <h3 className="text-pink text-lg font-normal mb-3 ls-51 uppercase">
            Conoce nuestro
          </h3>
        </Fade>
        <Fade direction="up" delay={800} cascade damping={0.1} triggerOnce>
          <div className="flex items-center justify-center gap-4">
            <GiStarsStack className="text-[#6B8E23] text-3xl lg:text-5xl" />
            <p className="text-3xl lg:text-5xl font-semibold text-lightgrey m-0">
              Top de recetas
            </p>
            <GiStarsStack className="text-[#6B8E23] text-3xl lg:text-5xl" />
          </div>
        </Fade>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-5">
        <Fade direction="up" delay={1000} cascade damping={0.1} triggerOnce>
          {recetas.map((receta) => {
            const ruta = usuarioId
              ? `/usuario/recetas/${receta.id}`
              : `/RecetaCompleta/recetas/${receta.id}`;

            return (
              <div
                key={receta.id}
                className="p-8 relative rounded-3xl bg-[#f1e0eb] cursor-pointer shadow-xl 
                transition-transform duration-300 transform hover:scale-105 hover:shadow-xl hover:ring-2
                 hover:ring-[#6B8E23]"
              >
                <div className="flex justify-center w-full">
                  <div className="bg-white flex items-center justify-center shadow-md w-[120px] h-[120px] rounded-lg overflow-hidden">
                    <Image
                      src={receta.imagen}
                      alt={receta.titulo}
                      width={120}
                      height={120}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>

                <h3 className="text-2xl text-black font-semibold text-center mt-8">
                  {receta.titulo}
                </h3>
                <p className="text-center text-base font-medium text-gray-700 mb-2 mt-2">
                  Por:{" "}
                  <span className="text-green-900 font-semibold">
                    {receta.usuario?.nombreUsuario || "anonimo"}
                  </span>
                </p>

                <div className="flex items-center justify-center mt-3 text-yellow-500">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <svg
                      key={index}
                      className={`w-5 h-5 ${
                        index < Math.round(receta.promedio)
                          ? "fill-current"
                          : "text-gray-300"
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.572-.955L10 0l2.94 5.955 6.572.955-4.756 4.635 1.122 6.545z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-gray-600 text-sm">
                    ({receta.promedio.toFixed(1)})
                  </span>
                </div>

                <div className="flex items-center justify-center mt-4">
                  <Link href={ruta}>
                    <p className="text-center text-lg font-medium text-[#8B1C62] hover:underline cursor-pointer">
                      Ver
                    </p>
                  </Link>
                </div>
              </div>
            );
          })}
        </Fade>
      </div>
    </div>
  );
}

"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Fade } from "react-awesome-reveal";

const cardData = [
  {
    imgSrc: "/images/Features/Salado.png",
    heading: "Saladas",
    subheading: "Saladas",
    idTipoSabor: 2,
  },
  {
    imgSrc: "/images/Features/Dulces.png",
    heading: "Dulces",
    idTipoSabor: 1,
  },
  {
    imgSrc: "/images/Features/Amargo.png",
    heading: "Amargas",
    idTipoSabor: 3,
  },
  {
    imgSrc: "/images/Features/Acido.png",
    heading: "Acidas",
    heading: "Acidas",
    idTipoSabor: 4,
  },
];

const DestacadosPage = () => {
  const router = useRouter();

  const handleClick = async (idTipoSabor) => {
    try {
      const res = await fetch(
        `/api/receta/destacadasSabor?tipoSaborId=${idTipoSabor}`
      );
      const data = await res.json();
      if (res.ok) {
        router.push(`/usuario/recetas/${data.id}`);
      } else {
        router.push("/not-found"); // Redirige a la página not-found
      }
    } catch (error) {
      router.push("/not-found"); // También redirige en caso de error
    }
  };
  return (
    <div className="relative  mx-auto max-w-7xl py-20 px-6  " >
      <div className="text-center mb-14 ">
        <Fade direction="up" delay={400} cascade damping={0.1} triggerOnce>
          <h3 className="text-pink text-lg font-normal mb-3 ls-51 uppercase">
            Recetas
          </h3>
        </Fade>
        <Fade direction="up" delay={800} cascade damping={0.1} triggerOnce>
          <p className="text-3xl lg:text-5xl font-semibold text-lightgrey">
            Destacadas por sabor <br />
          </p>
        </Fade>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-y-20 gap-x-5 mt-32 ">
        <Fade direction="up" delay={1000} cascade damping={0.1} triggerOnce>
          {cardData.map((items, i) => (
            <div
             key={i}
  className="card-b p-8 relative rounded-3xl cursor-pointer 
  shadow-md transition-transform duration-300 transform hover:scale-105 hover:shadow-xl
   hover:ring-2 hover:ring-[#8B1C62]"
  onClick={() => handleClick(items.idTipoSabor)}
            >
             <div
  className="flex justify-center absolute top-[-80%] 
  sm:top-[-40%] md:top-[-55%] lg:top-[-45%] left-[0%] w-full"
>
  <div className="bg-white rounded-full w-32 h-32 flex items-center justify-center shadow-md">
    <Image
      src={items.imgSrc}
      alt={items.heading}
      width={90}
      height={90}
      className="object-contain"
    />
  </div>
</div>
              <h3 className="text-2xl text-black font-semibold text-center mt-16">
                {items.heading}
              </h3>
              <p className="text-center text-base font-medium text-gray-700 mb-2 mt-2">
                Descubre la{" "}
                <span className="text-green-900 font-semibold">
                  receta
                </span>{" "}
                <br />
                que conquistará tu paladar.
              </p>
              <div className="flex items-center justify-center ">
                <p className="text-center text-lg font-medium mt-2 text-[#8B1C62] ">
                  Ver
                </p>
              </div>
            </div>
          ))}
        </Fade>
      </div>
    </div>
  );
};

export default DestacadosPage;

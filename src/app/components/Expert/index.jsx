"use client";
import dynamic from 'next/dynamic';
import { Fade } from "react-awesome-reveal";
import Image from "next/image";

// Carga react-slick solo en el cliente
const Slider = dynamic(() => import('react-slick'), {
  ssr: false,
  loading: () => <div className="text-center p-8">Cargando carrusel...</div>
});

// Carga los estilos dinámicamente solo en el cliente
if (typeof window !== 'undefined') {
  import('slick-carousel/slick/slick.css');
  import('slick-carousel/slick/slick-theme.css');
}

// CAROUSEL DATA
const postData = [
  // ... (mantén tu array postData igual)
];

// CAROUSEL SETTINGS
const settings = {
  // ... (mantén tu objeto settings igual)
};

const Expert = () => {
  return (
    <div className="py-8 sm:py-12 bg-[#FEEDEA] overflow-hidden">
      <div className="mx-auto max-w-2xl lg:max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Fade direction="up" delay={400} triggerOnce>
            <h2 className="text-pink text-lg font-normal mb-3 tracking-widest uppercase">
              EXPERT CHEFS
            </h2>
          </Fade>
          <Fade direction="up" delay={800} triggerOnce>
            <h3 className="text-3xl lg:text-5xl font-semibold text-black">
              Let&apos;s meet the expert.
            </h3>
          </Fade>
        </div>

        <div className="px-2 sm:px-0">
          <Slider {...settings}>
            {postData.map((items, i) => (
              <div key={i} className="px-2">
                <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 my-4 mx-1">
                  <div className="relative h-64">
                    <Image
                      src={items.imgSrc}
                      alt={`${items.name} - ${items.profession}`}
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute bottom-4 right-4">
                      <Image
                        src="/images/Expert/Linkedin.svg"
                        alt="linkedin"
                        width={40}
                        height={40}
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-lightblack mt-4">
                    {items.name}
                  </h3>
                  <h4 className="text-lg text-lightblack opacity-50">
                    {items.profession}
                  </h4>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Expert;
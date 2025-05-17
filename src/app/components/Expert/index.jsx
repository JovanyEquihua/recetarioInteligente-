"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Image from "next/image";
import { Fade } from "react-awesome-reveal";

// CAROUSEL DATA (igual que antes)
const postData = [
  {
    profession: "Senior Chef",
    name: "Shoo Thar Mien",
    imgSrc: "/images/Expert/boyone.svg",
  },
  {
    profession: "Junior Chef",
    name: "Shoo Thar Mien",
    imgSrc: "/images/Expert/girl.png",
  },
  {
    profession: "Junior Chef",
    name: "Shoo Thar Mien",
    imgSrc: "/images/Expert/boytwo.svg",
  },
  {
    profession: "Junior Chef",
    name: "Shoo Thar Mien",
    imgSrc: "/images/Expert/girl.png",
  },
  {
    profession: "Junior Chef",
    name: "Shoo Thar Mien",
    imgSrc: "/images/Expert/girl.png",
  },
  {
    profession: "Junior Chef",
    name: "Shoo Thar Mien",
    imgSrc: "/images/Expert/girl.png",
  },
];


// CAROUSEL SETTINGS - CONFIGURACIÓN MEJORADA
const settings = {
  dots: false,
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: false,
  autoplay: true, // Si quieres autoplay, cambia a true
  speed: 500, // Reducido de 4000 a 500 (ms)
  cssEase: "ease-out", // Cambiado de "linear"
  centerMode: true,
  centerPadding: "0",
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
        centerPadding: "0",
      },
    },
    {
      breakpoint: 800,
      settings: {
        slidesToShow: 2,
        centerPadding: "0",
      },
    },
    {
      breakpoint: 450,
      settings: {
        slidesToShow: 1,
        centerPadding: "0",
      },
    },
  ],
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
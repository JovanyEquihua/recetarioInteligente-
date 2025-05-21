"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Fade } from "react-awesome-reveal";

const cardData = [
  {
    imgSrc: "/images/Features/featureOne.svg",
    heading: "Saladas",
    subheading:  "",
    link: "Ir >",
  },
  {
    imgSrc: "/images/Features/featureTwo.svg",
    heading: "Dulces",
    subheading: "",
    link: "Ir >",
  },
  {
    imgSrc: "/images/Features/featureThree.svg",
    heading: "Amargas",
    subheading: "",
    link: "Ir >",
  },
  {
    imgSrc: "/images/Features/featureFour.svg",
    heading: "Acidas",
    subheading: "",
    link: "Ir >",
  },
];

const DestacadosPage = () => {
  return (
    <div>
      <div className="   mx-auto max-w-7xl py-20 px-6" id="about-section">
        <div className="text-center mb-14">
          <Fade
            direction={"up"}
            delay={400}
            cascade
            damping={1e-1}
            triggerOnce={true}
          >
            <h3 className="text-pink text-lg font-normal mb-3 ls-51 uppercase">
            Recetas
            </h3>
          </Fade>
          <Fade
            direction={"up"}
            delay={800}
            cascade
            damping={1e-1}
            triggerOnce={true}
          >
            <p className="text-3xl lg:text-5xl font-semibold text-lightgrey">
             Destacadas por sabor <br /> 
            </p>
          </Fade>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-y-20 gap-x-5 mt-32">
          <Fade
            direction={"up"}
            delay={1000}
            cascade
            damping={1e-1}
            triggerOnce={true}
          >
            {cardData.map((items, i) => (
              <div className="card-b p-8 relative rounded-3xl" key={i}>
                <div className="work-img-bg rounded-full flex justify-center absolute top-[-50%] 
                sm:top-[-40%] md:top-[-55%] lg:top-[-45%] left-[0%]">
                  <Image
                    src={items.imgSrc}
                    alt={items.imgSrc}
                    width={510}
                    height={10}
                  />
                </div>
                <h3 className="text-2xl text-black font-semibold text-center mt-16">
                  {items.heading}
                </h3>
                <p className="text-lg font-normal text-black text-center text-opacity-50 mt-2">
                  {items.subheading}
                </p>
                <div className="flex items-center justify-center ">
                  <Link href="/">
                    <p className="text-center text-lg font-medium  mt-2  text-[#8B1C62]">
                      {items.link}
                  
                    </p>
                  </Link>
                </div>
              </div>
            ))}
          </Fade>
        </div>
      </div>
    </div>
  );
};

export default DestacadosPage;
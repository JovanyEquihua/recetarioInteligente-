// components/SafeNavbarin.tsx
"use client";
import dynamic from "next/dynamic";

const Navbarin = dynamic(() => import("./Navbar/index"), { ssr: false });

export default Navbarin;

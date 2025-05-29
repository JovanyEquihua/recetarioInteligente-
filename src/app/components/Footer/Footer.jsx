import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const socialLinks = [
  { Icon: FaFacebookF, link: "https://facebook.com/chefpick" },
  { Icon: FaInstagram, link: "https://instagram.com/chefpick" },
  { Icon: FaTwitter, link: "https://twitter.com/chefpick" },
];

const Footer = () => {
   return (
    <footer className="bg-[#FAF5F8] pt-16 pb-8 border-t border-[#f0e0ea]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
        {/* Frase destacada - Izquierda */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-[#8B1C62] mb-4 leading-tight">
            "Transforma ingredientes<br />en experiencias"
          </h2>
          <p className="text-lg text-[#2D2D2D]">
            Descubre el chef que llevas dentro
          </p>
        </div>

        {/* Logo y redes - Centro */}
        <div className="flex flex-col items-center space-y-6">
          <div className="bg-white shadow-lg rounded-full p-3 border-2 border-[#8B1C62]">
            <img src="/images/Logo/logo.png" alt="logo" width={80} height={80} />
          </div>
          <div className="flex gap-4">
            {[FaFacebookF, FaInstagram, FaTwitter].map((Icon, i) => (
              <Link key={i} href={socialLinks[i].link} target="_blank">
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-white shadow-md hover:bg-[#8B1C62] transition-colors duration-300">
                  <Icon className="text-[#2D2D2D] hover:text-white text-xl transition-colors duration-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Enlaces y políticas - Derecha */}
        <div className="grid grid-cols-2 gap-6 text-center md:text-right">
          <div className="space-y-3">
            <h3 className="text-[#6B8E23] font-semibold mb-2">Explorar</h3>
            <Link href="/mapa" className="block text-[#2D2D2D] hover:text-[#8B1C62] transition">
              Mapa
            </Link>
            <Link href="/recetas" className="block text-[#2D2D2D] hover:text-[#6B8E23] transition">
              Recetas
            </Link>
          </div>
          <div className="space-y-3">
            <h3 className="text-[#6B8E23] font-semibold mb-2">Legal</h3>
            <Link href="/politica-privacidad" className="block text-[#2D2D2D] hover:text-[#8B1C62] transition">
              Privacidad
            </Link>
            <Link href="/terminos" className="block text-[#2D2D2D] hover:text-[#6B8E23] transition">
              Términos
            </Link>
            <Link href="/cookies" className="block text-[#2D2D2D] hover:text-[#8B1C62] transition">
              Cookies
            </Link>
          </div>
        </div>
      </div>

      {/* Créditos */}
      <div className="text-center text-sm text-gray-600 mt-12 pt-6 border-t border-[#e8d8e2]">
        © 2025 ChefPick – Agui Martínez | Jovany Equihua | Ethan Ginori | Adrian
        Flores | Marco Ruiz | Roberto González
      </div>
    </footer>
  );
};
export default Footer;

'use client';

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FiHome,
  FiAlertTriangle,
  FiCheckCircle,
  FiMessageSquare,
  FiUser,
  FiLogOut,
  FiSettings,
  FiBell,
  FiMenu
} from "react-icons/fi";

export default function ModeratorLayout({ children }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navbar */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => router.push("/moderator")}
            >
              <div className="relative group-hover:rotate-12 transition-transform duration-300">
                <Image 
                  src="/images/Logo/logo.png" 
                  alt="ChefPick Moderador" 
                  width={48} 
                  height={48} 
                  className="rounded-full border-2 border-white shadow-md group-hover:border-blue-400 transition-colors duration-300"
                />
                <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-blue-300 group-hover:animate-ping opacity-0 group-hover:opacity-70 transition-all duration-700 pointer-events-none"></div>
              </div>
              <div className="transform group-hover:translate-x-1 transition-transform duration-300">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">ChefPick</h1>
                <p className="text-xs font-medium text-blue-400">Moderation Panel</p>
              </div>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-6">
              {session?.user && (
                <>
                  <nav className="flex space-x-1 bg-white/80 rounded-full p-1 shadow-inner">
                    <button 
                      className={`px-4 py-2 rounded-full transition-all flex items-center space-x-1 ${pathname === "/moderator" ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:text-blue-500'}`}
                      onClick={() => router.push("/moderator")}
                    >
                      <FiHome className="text-lg" />
                      <span>Dashboard</span>
                    </button>
                    <button 
                      className={`px-4 py-2 rounded-full transition-all flex items-center space-x-1 ${pathname.includes("reportes") ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:text-blue-500'}`}
                      onClick={() => router.push("/moderator/reportes")}
                    >
                      <FiAlertTriangle className="text-lg" />
                      <span>Reports</span>
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">3</span>
                    </button>
                    <button 
                      className={`px-4 py-2 rounded-full transition-all flex items-center space-x-1 ${pathname.includes("revision") ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:text-blue-500'}`}
                      onClick={() => router.push("/moderator/revision")}
                    >
                      <FiCheckCircle className="text-lg" />
                      <span>Review</span>
                    </button>
                    <button 
                      className={`px-4 py-2 rounded-full transition-all flex items-center space-x-1 ${pathname.includes("mensajes") ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:text-blue-500'}`}
                      onClick={() => router.push("/moderator/mensajes")}
                    >
                      <FiMessageSquare className="text-lg" />
                      <span>Messages</span>
                    </button>
                  </nav>

                  {/* User avatar menu */}
                  <div className="relative ml-4">
                    <button 
                      className="flex items-center space-x-3 focus:outline-none group"
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                      <div className="relative">
                        <FiBell className="text-xl text-gray-500 hover:text-blue-500 transition-colors" />
                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
                      </div>
                      {session.user.image ? (
                        <div className="relative group-hover:scale-105 transition-transform">
                          <img 
                            src={session.user.image} 
                            alt="Moderador"
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md group-hover:border-blue-400 transition-colors"
                          />
                          <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs p-1 rounded-full border-2 border-white">
                            <FiCheckCircle />
                          </span>
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center border-2 border-white shadow-md">
                          <FiUser className="text-white text-lg" />
                        </div>
                      )}
                    </button>

                    {/* Dropdown */}
                    {isMenuOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100 overflow-hidden">
                        <div className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-400 text-white">
                          <p className="font-medium">Sesión de moderador</p>
                          <p className="text-xs opacity-90 truncate">{session.user.email}</p>
                        </div>
                       
                        
                        <div className="">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center px-4 py-3 text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                          >
                            <FiLogOut className="mr-3" /> 
                            <span>Cerrar sesión</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 focus:outline-none rounded-full bg-white/80 shadow-md hover:bg-blue-50 transition-colors"
              >
                <FiMenu className="text-xl text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content body */}
      <main className="pt-20 px-4">
        {children}
      </main>
    </div>
  );
}

import { useState, useEffect } from "react";
import SwupLink from "./SwupLink";
import Image from "next/image";

interface NavigationProps {
  activePage?: "home" | "about" | "features" | "contact";
}

export default function Navigation({ activePage }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const isHome = activePage === "home";
  const showScrolledStyle = isScrolled || !isHome;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home", key: "home" },
    { href: "/about", label: "About", key: "about" },
    { href: "/features", label: "Features", key: "features" },
    { href: "/contact", label: "Contact", key: "contact" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${showScrolledStyle
        ? "backdrop-blur-md bg-white/90 border-b border-slate-200/50"
        : "bg-transparent border-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <SwupLink href="/" className="flex items-center space-x-2">
            <Image src="/images/logo.png" alt="Logo" width={70} height={70} />
          </SwupLink>
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <SwupLink
                key={link.key}
                href={link.href}
                className={`transition-colors font-medium ${activePage === link.key
                  ? showScrolledStyle
                    ? "text-indigo-600"
                    : "text-white"
                  : showScrolledStyle
                    ? "text-slate-700 hover:text-indigo-600"
                    : "text-white/80 hover:text-white"
                  }`}
              >
                {link.label}
              </SwupLink>
            ))}
          </div>
          <div className="px-10"></div>
          {/* <button className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-105">
            Get Started
          </button> */}
        </div>
      </div>
    </nav>
  );
}


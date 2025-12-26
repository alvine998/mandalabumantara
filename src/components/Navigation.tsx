import { useState, useEffect } from "react";
import SwupLink from "./SwupLink";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Navigation() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, forceUpdate] = useState({});

  // Get current path from window location for reliability
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const isHome = currentPath === '/';
  const showScrolledStyle = isScrolled || !isHome || mobileMenuOpen;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  // Force re-render on Swup navigation
  useEffect(() => {
    const handleNavigation = () => {
      forceUpdate({});
    };

    document.addEventListener("swup:contentReplaced", handleNavigation);
    document.addEventListener("swup:pageView", handleNavigation);

    return () => {
      document.removeEventListener("swup:contentReplaced", handleNavigation);
      document.removeEventListener("swup:pageView", handleNavigation);
    };
  }, []);

  const navLinks = [
    { href: "/", label: "Home", key: "home", isActive: currentPath === "/" },
    { href: "/about", label: "About", key: "about", isActive: currentPath === "/about" },
    { href: "/features", label: "Features", key: "features", isActive: currentPath === "/features" },
    { href: "/contact", label: "Contact", key: "contact", isActive: currentPath === "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-[100] transition-all duration-300 ${showScrolledStyle
        ? "backdrop-blur-md bg-white/90 border-b border-slate-200/50"
        : "bg-transparent border-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <SwupLink href="/" className="flex items-center space-x-2 z-[120] relative">
            <Image src="/images/logo.png" alt="Logo" width={70} height={70} />
          </SwupLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <SwupLink
                key={link.key}
                href={link.href}
                className={`transition-colors font-medium ${link.isActive
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

          <div className="hidden md:block px-10"></div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden z-[120] p-2 text-slate-800 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-current transform transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''} ${!showScrolledStyle && !mobileMenuOpen ? 'bg-white' : 'bg-slate-800'}`} />
              <span className={`w-full h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'} ${!showScrolledStyle && !mobileMenuOpen ? 'bg-white' : 'bg-slate-800'}`} />
              <span className={`w-full h-0.5 bg-current transform transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''} ${!showScrolledStyle && !mobileMenuOpen ? 'bg-white' : 'bg-slate-800'}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay/Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[105] md:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Sidebar Drawer */}
      <div className={`fixed top-0 right-0 bottom-0 w-full bg-white z-[110] transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl flex flex-col pt-24 h-screen ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col bg-white w-full">
          {navLinks.map((link) => (
            <SwupLink
              key={link.key}
              href={link.href}
              className={`text-lg font-medium px-4 py-3 rounded-xl transition-colors ${link.isActive
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
              onClick={() => { setMobileMenuOpen(false); console.log(link.href, router.pathname) }}
            >
              {link.label}
            </SwupLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

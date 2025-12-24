import SwupLink from "./SwupLink";

interface NavigationProps {
  activePage?: "home" | "about" | "features" | "contact";
}

export default function Navigation({ activePage }: NavigationProps) {
  const navLinks = [
    { href: "/", label: "Home", key: "home" },
    { href: "/about", label: "About", key: "about" },
    { href: "/features", label: "Features", key: "features" },
    { href: "/contact", label: "Contact", key: "contact" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/90 border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <SwupLink href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Mandala
            </span>
          </SwupLink>
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <SwupLink
                key={link.key}
                href={link.href}
                className={`transition-colors font-medium ${
                  activePage === link.key
                    ? "text-indigo-600"
                    : "text-slate-700 hover:text-indigo-600"
                }`}
              >
                {link.label}
              </SwupLink>
            ))}
          </div>
          <button className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-105">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}


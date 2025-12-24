import SwupLink from "./SwupLink";

export default function Footer() {
  const footerLinks = [
    { href: "/about", label: "About" },
    { href: "/features", label: "Features" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <footer className="py-12 px-6 sm:px-8 lg:px-12 border-t border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Mandala
            </span>
          </div>
          <div className="flex space-x-6 text-slate-600">
            {footerLinks.map((link) => (
              <SwupLink
                key={link.href}
                href={link.href}
                className="hover:text-indigo-600 transition-colors"
              >
                {link.label}
              </SwupLink>
            ))}
          </div>
        </div>
        <div className="mt-8 text-center text-slate-500">
          <p>© 2024 Mandala. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}


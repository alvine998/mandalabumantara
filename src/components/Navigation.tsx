import { useState, useEffect } from "react";
import SwupLink from "./SwupLink";
import Image from "next/image";
import { useRouter } from "next/router";
import { subCompanyService, SubCompany } from "@/lib/services/sub-company-service";

export default function Navigation() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [subCompanies, setSubCompanies] = useState<SubCompany[]>([]);

  // Get current path for active states
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const showScrolledStyle = isScrolled || mobileMenuOpen;

  // Helper function to slugify company names
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch sub-companies
  useEffect(() => {
    const fetchSubCompanies = async () => {
      try {
        const companies = await subCompanyService.getAllSubCompanies();
        setSubCompanies(companies);
      } catch (error) {
        console.error("Error fetching sub-companies:", error);
      }
    };
    fetchSubCompanies();
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  const [projectsOpen, setProjectsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home", key: "home", isActive: currentPath === "/" },
    { href: "/about", label: "About", key: "about", isActive: currentPath === "/about" },
    { href: "/news", label: "News", key: "news", isActive: currentPath.startsWith("/news") },
    { href: "/gallery", label: "Gallery", key: "gallery", isActive: currentPath === "/gallery" },
    { href: "/contact", label: "Contact", key: "contact", isActive: currentPath === "/contact" },
  ];

  // Generate project links from sub-companies
  const projectLinks = subCompanies.map(company => ({
    href: `/${slugify(company.name)}`,
    label: company.name,
  }));

  // Check if any project page is active
  const isProjectActive = projectLinks.some(project => currentPath.startsWith(project.href));

  return (
    <nav
      className={`fixed top-0 w-full z-[100] transition-all duration-300 ${showScrolledStyle
        ? "backdrop-blur-md bg-white/90 border-b border-slate-200/50"
        : "bg-transparent border-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <a href="/" data-no-swup className="flex items-center space-x-2 z-[120] relative">
            <Image src="/images/logo.png" alt="Logo" width={70} height={70} />
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              link.key === "home" ? (
                <a
                  key={link.key}
                  href={link.href}
                  data-no-swup
                  className={`transition-colors font-medium ${link.isActive
                    ? "text-amber-500"
                    : "text-slate-700 hover:text-amber-500"
                    }`}
                >
                  {link.label}
                </a>
              ) : (
                <SwupLink
                  key={link.key}
                  href={link.href}
                  className={`transition-colors font-medium ${link.isActive
                    ? "text-amber-500"
                    : "text-slate-700 hover:text-amber-500"
                    }`}
                >
                  {link.label}
                </SwupLink>
              )
            ))}

            {/* Projects Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setProjectsOpen(true)}
              onMouseLeave={() => setProjectsOpen(false)}
            >
              <button
                className={`transition-colors font-medium flex items-center space-x-1 ${isProjectActive
                  ? "text-amber-500"
                  : "text-slate-700 hover:text-amber-500"
                  }`}
              >
                <span>Projects</span>
                <svg
                  className={`w-4 h-4 transition-transform ${projectsOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 transition-all duration-200 ${projectsOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                  }`}
              >
                {projectLinks.map((project) => (
                  <SwupLink
                    key={project.href}
                    href={project.href}
                    className={`block px-4 py-3 transition-colors ${currentPath === project.href
                      ? "bg-amber-50 text-amber-500"
                      : "text-slate-700 hover:bg-slate-50 hover:text-amber-500"
                      }`}
                  >
                    {project.label}
                  </SwupLink>
                ))}
              </div>
            </div>
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
      <div className={`fixed top-0 right-0 bottom-0 w-full bg-white z-[110] transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl flex flex-col pt-24 h-screen overflow-y-auto ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col bg-white w-full px-4">
          {navLinks.map((link) => (
            link.key === "home" ? (
              <a
                key={link.key}
                href={link.href}
                data-no-swup
                className={`text-lg font-medium px-4 py-3 rounded-xl transition-colors ${link.isActive
                  ? "bg-amber-50 text-amber-500"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                onClick={() => { setMobileMenuOpen(false); }}
              >
                {link.label}
              </a>
            ) : (
              <SwupLink
                key={link.key}
                href={link.href}
                className={`text-lg font-medium px-4 py-3 rounded-xl transition-colors ${link.isActive
                  ? "bg-amber-50 text-amber-500"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                onClick={() => { setMobileMenuOpen(false); console.log(link.href, router.pathname) }}
              >
                {link.label}
              </SwupLink>
            )
          ))}

          {/* Projects Section in Mobile */}
          <div className="mt-2">
            <button
              onClick={() => setProjectsOpen(!projectsOpen)}
              className={`w-full text-left text-lg font-medium px-4 py-3 rounded-xl transition-colors flex items-center justify-between ${isProjectActive
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
              <span>Projects</span>
              <svg
                className={`w-5 h-5 transition-transform ${projectsOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Project Links */}
            <div className={`overflow-hidden transition-all duration-300 ${projectsOpen ? 'max-h-48' : 'max-h-0'}`}>
              <div className="pl-4 pt-2 space-y-1">
                {projectLinks.map((project) => (
                  <SwupLink
                    key={project.href}
                    href={project.href}
                    className={`block text-base px-4 py-2.5 rounded-lg transition-colors ${currentPath === project.href
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {project.label}
                  </SwupLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

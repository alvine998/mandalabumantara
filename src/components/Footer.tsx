import Image from "next/image";
import SwupLink from "./SwupLink";
import { Twitter, Github, Linkedin, MessageCircle } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    company: [
      { href: "/about", label: "About Us" },
      { href: "/gallery", label: "Gallery" },
      { href: "/contact", label: "Contact" },
    ],
    project: [
      { href: "/mandala-bumi-nusantara", label: "Mandala Bumi Nusantara" },
      { href: "/vistara", label: "Vistara" },
      // { href: "#", label: "API Reference" },
    ],
    legal: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-of-service", label: "Terms of Service" },
      { href: "/cookie-policy", label: "Cookie Policy" },
    ],
  };

  const socialLinks = [
    { href: "https://twitter.com/mandalabumantara", label: "Twitter", icon: Twitter },
    { href: "https://github.com/mandalabumantara", label: "GitHub", icon: Github },
    { href: "https://linkedin.com/mandalabumantara", label: "LinkedIn", icon: Linkedin },
    { href: "https://discord.com/mandalabumantara", label: "Discord", icon: MessageCircle },
  ];

  return (
    <footer className="py-16 px-6 sm:px-8 lg:px-12 border-t border-slate-200 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Image src="/images/logo.png" alt="Logo" width={60} height={60} />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-900 to-amber-500 bg-clip-text text-transparent">
                Mandala Bumantara
              </span>
            </div>
            <p className="text-slate-600 mb-6 leading-relaxed max-w-sm">
              Building amazing web experiences with smooth transitions and beautiful design. Powered by modern technologies.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-slate-100 hover:bg-amber-100 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                    aria-label={social.label}
                  >
                    <IconComponent className="w-5 h-5 text-slate-600 group-hover:text-amber-500 transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Company</h3>
            <ul className="space-y-3">
              {footerSections.company.map((link) => (
                <li key={link.href}>
                  <SwupLink
                    href={link.href}
                    className="text-slate-600 hover:text-amber-500 transition-colors"
                  >
                    {link.label}
                  </SwupLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerSections.project.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-600 hover:text-amber-500 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerSections.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-600 hover:text-amber-500 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-slate-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-semibold text-slate-900 mb-2">Stay Updated</h3>
              <p className="text-slate-600 text-sm">
                Subscribe to our newsletter for the latest updates and features.
              </p>
            </div>
            <div className="flex w-full md:w-auto max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 rounded-l-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <button className="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-r-lg font-medium hover:shadow-lg hover:shadow-blue-900/50 transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © {currentYear} Mandala Bumantara. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-slate-500">
              <span>Made with ❤️ in Indonesia</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Powered by Next.js</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

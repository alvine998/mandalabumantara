import { useState, useEffect } from "react";
import Image from "next/image";
import SwupLink from "./SwupLink";
import { Youtube, Instagram, Facebook, Music2 } from "lucide-react";
import { companyProfileService, CompanyProfile } from "@/lib/services/company-profile-service";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await companyProfileService.getProfile();
        setProfile(data);
      } catch (err) {
        console.error("Error loading profile into footer:", err);
      }
    };
    loadProfile();
  }, []);

  const footerSections = {
    company: [
      { href: "/about", label: "About Us" },
      { href: "/gallery", label: "Gallery" },
      { href: "/contact", label: "Contact" },
    ],
    project: [
      { href: "/mandala-bumi-nusantara", label: "Mandala Bumi Nusantara" },
      { href: "/vistara", label: "Vistara" },
    ],
    legal: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-of-service", label: "Terms of Service" },
      { href: "/cookie-policy", label: "Cookie Policy" },
    ],
  };

  const socialLinks = [
    { href: profile?.youtube, label: "YouTube", icon: Youtube },
    { href: profile?.tiktok, label: "TikTok", icon: Music2 }, // Music2 as a fallback for TikTok if not in lucide
    { href: profile?.instagram, label: "Instagram", icon: Instagram },
    { href: profile?.facebook, label: "Facebook", icon: Facebook },
  ].filter(link => link.href);

  return (
    <footer className="py-16 px-6 sm:px-8 lg:px-12 border-t border-slate-200 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative w-12 h-12">
                <Image
                  src={profile?.logo || "/images/logo.png"}
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-900 to-amber-500 bg-clip-text text-transparent">
                {profile?.name || "Mandala Bumantara"}
              </span>
            </div>
            <p className="text-slate-600 mb-6 text-xs leading-relaxed max-w-sm">
              {profile?.description || "Building amazing web experiences with smooth transitions and beautiful design. Powered by modern technologies."}
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

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <p className="text-slate-500 text-sm">
              © {currentYear} Mandala Bumantara. All rights reserved.
            </p>
            {/* <div className="flex items-center space-x-6 text-sm text-slate-500">
              <span>Made with ❤️ in Indonesia</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Powered by Next.js</span>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}

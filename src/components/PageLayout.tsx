import { ReactNode } from "react";
import localFont from "next/font/local";
import Navigation from "./Navigation";
import Footer from "./Footer";

const geistSans = localFont({
  src: "../pages/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../pages/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

interface PageLayoutProps {
  children: ReactNode;
  activePage?: "home" | "about" | "features" | "contact";
  background?: "default" | "gradient";
}

export default function PageLayout({
  children,
  activePage,
  background = "gradient",
}: PageLayoutProps) {
  const backgroundClasses = {
    default: "bg-white",
    gradient: "bg-gradient-to-br from-white via-blue-50 to-indigo-50",
  };

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} min-h-screen ${backgroundClasses[background]}`}>
      <div>
        <Navigation />
      </div>
      <main data-swup>
        {children}
      </main>
      <div>
        <Footer />
      </div>
    </div>
  );
}


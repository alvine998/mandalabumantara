import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function SplashScreen() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Only show on home page ("/")
    if (router.pathname !== "/") {
      return;
    }

    setIsVisible(true);

    // Prevent body scroll while splash is visible
    document.body.style.overflow = "hidden";

    // Function to get and stop Lenis
    const stopLenis = () => {
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.stop();
      }
    };

    // Function to get and start Lenis
    const startLenis = () => {
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.start();
      }
    };

    // Try to stop Lenis immediately and also check periodically
    stopLenis();
    const lenisCheckInterval = setInterval(stopLenis, 100);

    // Show splash for 2.5 seconds
    const timer = setTimeout(() => {
      clearInterval(lenisCheckInterval);
      setIsAnimating(true);

      // Remove from DOM after animation
      setTimeout(() => {
        setIsVisible(false);
        // Restore body scroll
        document.body.style.overflow = "unset";

        // Resume Lenis
        startLenis();
      }, 500); // Match animation duration
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearInterval(lenisCheckInterval);
      document.body.style.overflow = "unset";
      startLenis();
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 transition-opacity duration-500 ${isAnimating ? "opacity-0" : "opacity-100"
        }`}
    >
      {/* Animated Logo */}
      <div className="flex flex-col items-center space-y-8">
        {/* Logo Container with Animation */}
        <div className="relative">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl transform animate-pulse">
            <Image src="/images/logo.png" alt="Logo" width={90} height={90} />
          </div>
          {/* Rotating Ring */}
          <div className="absolute inset-0 border-4 border-white/30 rounded-2xl animate-spin-slow"></div>
          {/* Outer Glow */}
          <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-xl animate-pulse"></div>
        </div>

        {/* Brand Name */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 animate-fade-in">
            Mandala Bumantara
          </h1>
          <p className="text-white/80 text-lg animate-fade-in-delay">
            Building Amazing Experiences
          </p>
        </div>

        {/* Loading Dots */}
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
    </div>
  );
}


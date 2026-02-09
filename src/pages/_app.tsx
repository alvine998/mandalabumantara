import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import Lenis from "@studio-freight/lenis";
import Head from "next/head";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Initialize only on client side
    if (typeof window === "undefined") return;

    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Make Lenis available globally for SplashScreen
    (window as any).lenis = lenis;

    // Animation frame loop for Lenis
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, []);

  return (
    <>
      <Head>
        <title>Mandala Bumantara</title>
      </Head>
      <ToastProvider>
        <AuthProvider>
          <SplashScreen />
          <Component {...pageProps} />
        </AuthProvider>
      </ToastProvider>
    </>
  );
}



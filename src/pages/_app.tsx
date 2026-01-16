import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import Swup from "swup";
import SwupFadeTheme from "@swup/fade-theme";
import SwupScrollPlugin from "@swup/scroll-plugin";
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

    // Initialize Swup
    const swup = new Swup({
      plugins: [
        new SwupFadeTheme(),
        new SwupScrollPlugin({
          doScrollingRightAway: false,
          animateScroll: {
            betweenPages: false,
            samePageWithHash: false,
            samePage: false,
          }, // Disable Swup scroll animation since Lenis handles it


        }),
      ],
      containers: ["[data-swup]"],
      cache: true,
      animateHistoryBrowsing: true,
      linkSelector: 'a[href^="/"]:not([data-no-swup])',
      skipPopStateHandling: () => false,
    });

    // Handle page updates after Swup navigation
    swup.hooks.on("content:replace", () => {
      // Scroll to top smoothly using Lenis
      lenis.scrollTo(0, { immediate: false });
    });

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      swup.destroy();
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



import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import VideoHero from "@/components/VideoHero";
import Section from "@/components/Section";
import FeatureCard from "@/components/FeatureCard";
import Button from "@/components/Button";
import SwupLink from "@/components/SwupLink";

const VIDEO_OPTIONS = [
  {
    type: "youtube",
    src: "https://youtu.be/l6EzZafb1Pk?si=yDlF-OxlWCMldbu_", // Dummy example
  },
];

export default function Home() {
  const [videoOption, setVideoOption] = useState(VIDEO_OPTIONS[0]);

  useEffect(() => {
    // Randomize video on mount (client-side only to avoid hydration mismatch)
    const randomIndex = Math.floor(Math.random() * VIDEO_OPTIONS.length);
    setVideoOption(VIDEO_OPTIONS[randomIndex]);
  }, []);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: "⚡",
      title: "Lightning Fast",
      description:
        "Optimized performance with instant page transitions and smooth animations.",
    },
    {
      icon: "🎨",
      title: "Beautiful Design",
      description:
        "Modern UI components with stunning gradients and elegant typography.",
    },
    {
      icon: "🚀",
      title: "Easy to Use",
      description:
        "Simple integration with powerful customization options for your needs.",
    },
  ];

  return (
    <PageLayout activePage="home">
      <VideoHero
        videoType={videoOption.type as "local" | "youtube"}
        videoSrc={videoOption.src}
        badge="✨ Welcome to the Future"
        title="Experiences"
        titleGradient="Build Amazing"
        description="Create stunning web experiences with smooth transitions and beautiful design. Powered by Swup for seamless navigation."
        primaryButton={{ label: "Start Building" }}
        secondaryButton={{ label: "Explore Features", href: "/features" }}
      />

      <Section padding="large">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6 px-4 py-2 bg-indigo-100 rounded-full border border-indigo-200">
              <span className="text-sm font-medium text-indigo-700">
                ✨ Welcome to the Future
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                Build Amazing
              </span>
              <br />
              <span className="text-slate-900">Experiences</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 mb-10 leading-relaxed">
              Create stunning web experiences with smooth transitions and
              beautiful design. Powered by Swup for seamless navigation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="primary" className="px-8 py-4 text-lg">
                Start Building
              </Button>
              <Button
                variant="secondary"
                href="/features"
                className="px-8 py-4 text-lg"
              >
                Explore Features
              </Button>
            </div>
          </div>

          {/* Hero Image/Visual */}
          <div className="mt-20 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50">
              <div className="aspect-video bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold">Lightning Fast</p>
                  <p className="text-lg opacity-90">Smooth Transitions</p>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
          </div>
        </div>
      </Section>

      <Section background="light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-900">
              Powerful Features
            </h2>
            <p className="text-xl text-slate-600">
              Everything you need to build amazing experiences
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of developers building amazing experiences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" className="px-8 py-4 text-lg bg-white text-indigo-600 hover:bg-white/90">
                Start Free Trial
              </Button>
              <Button
                variant="outline"
                href="/contact"
                className="px-8 py-4 text-lg"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Floating/Centered Search Bar */}
      <div
        className={`fixed left-1/2 transform -translate-x-1/2 z-40 w-full max-w-lg px-6 transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${isScrolled
          ? "bottom-8 translate-y-0 scale-100"
          : "bottom-1/2 translate-y-1/2 scale-110"
          }`}
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-30 blur-md animate-pulse"></div>
        <div className="relative bg-white/80 backdrop-blur-xl rounded-full shadow-2xl flex items-center p-2 border border-white/50 ring-1 ring-white/50">
          <div className="pl-4 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Explore Your Future Here..."
            className="w-full bg-transparent border-none focus:ring-0 outline-none text-slate-800 placeholder-slate-500/80 h-10 px-3 text-base focus:outline-none"
          />
          <div className="flex items-center space-x-1">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full transition-colors shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}


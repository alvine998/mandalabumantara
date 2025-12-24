import SwupLink from "./SwupLink";

interface VideoHeroProps {
  badge?: string;
  title: string;
  titleGradient?: string;
  description: string;
  primaryButton?: {
    label: string;
    onClick?: () => void;
  };
  secondaryButton?: {
    label: string;
    href: string;
  };
  showScrollIndicator?: boolean;
  videoSrc?: {
    mp4?: string;
    webm?: string;
  };
}

export default function VideoHero({
  badge = "✨ Welcome to the Future",
  title,
  titleGradient,
  description,
  primaryButton,
  secondaryButton,
  showScrollIndicator = true,
  videoSrc = {
    mp4: "/video-background.mp4",
    webm: "/video-background.webm",
  },
}: VideoHeroProps) {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        {videoSrc.mp4 && <source src={videoSrc.mp4} type="video/mp4" />}
        {videoSrc.webm && <source src={videoSrc.webm} type="video/webm" />}
      </video>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/60"></div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          {badge && (
            <div className="inline-block mb-6 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-white/50 shadow-lg">
              <span className="text-sm font-medium text-indigo-700">
                {badge}
              </span>
            </div>
          )}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            {titleGradient ? (
              <>
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient drop-shadow-lg">
                  {titleGradient}
                </span>
                <br />
                <span className="text-white drop-shadow-2xl">{title}</span>
              </>
            ) : (
              <span className="text-white drop-shadow-2xl">{title}</span>
            )}
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl text-white mb-10 leading-relaxed drop-shadow-lg font-medium">
            {description}
          </p>
          {(primaryButton || secondaryButton) && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {primaryButton && (
                <button
                  onClick={primaryButton.onClick}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                >
                  {primaryButton.label}
                </button>
              )}
              {secondaryButton && (
                <SwupLink
                  href={secondaryButton.href}
                  className="px-8 py-4 bg-white/90 backdrop-blur-sm text-slate-900 rounded-full font-semibold text-lg border-2 border-white/50 hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {secondaryButton.label}
                </SwupLink>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <svg
            className="w-6 h-6 text-white drop-shadow-lg"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      )}
    </section>
  );
}


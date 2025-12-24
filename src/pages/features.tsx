import PageLayout from "@/components/PageLayout";
import Section from "@/components/Section";
import FeatureCard from "@/components/FeatureCard";
import Button from "@/components/Button";

export default function Features() {
  const features = [
    {
      icon: "⚡",
      title: "Lightning Fast",
      description:
        "Optimized performance with instant page transitions and smooth animations. Experience blazing-fast navigation.",
      gradientColor: "from-yellow-400 to-orange-500",
    },
    {
      icon: "🎨",
      title: "Beautiful Design",
      description:
        "Modern UI components with stunning gradients and elegant typography. Every pixel is crafted with care.",
      gradientColor: "from-pink-400 to-rose-500",
    },
    {
      icon: "🚀",
      title: "Easy to Use",
      description:
        "Simple integration with powerful customization options. Get started in minutes, not hours.",
      gradientColor: "from-blue-400 to-cyan-500",
    },
    {
      icon: "📱",
      title: "Fully Responsive",
      description:
        "Perfect experience on all devices. From mobile phones to large desktop screens.",
      gradientColor: "from-purple-400 to-indigo-500",
    },
    {
      icon: "🔒",
      title: "Secure & Reliable",
      description:
        "Built with security in mind. Your data and users are protected with industry best practices.",
      gradientColor: "from-green-400 to-emerald-500",
    },
    {
      icon: "🌐",
      title: "Global Scale",
      description:
        "Built to handle millions of users. Scalable infrastructure that grows with your needs.",
      gradientColor: "from-indigo-400 to-purple-500",
    },
  ];

  return (
    <PageLayout activePage="features">
      <Section padding="large">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto">
            Everything you need to build amazing web experiences
          </p>
        </div>
      </Section>

      <Section>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                gradientColor={feature.gradientColor}
              />
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Ready to Experience These Features?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Start building amazing experiences today
            </p>
            <Button
              variant="primary"
              href="/contact"
              className="px-8 py-4 text-lg bg-white text-indigo-600 hover:bg-white/90"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}

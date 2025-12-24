import PageLayout from "@/components/PageLayout";
import Section from "@/components/Section";
import Button from "@/components/Button";

export default function About() {
  return (
    <PageLayout activePage="about">
      <Section padding="large">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                About Us
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 leading-relaxed">
              We're passionate about creating beautiful, performant web
              experiences
            </p>
          </div>

          <div className="space-y-12">
            <div className="p-8 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200">
              <h2 className="text-3xl font-bold mb-4 text-slate-900">
                Our Mission
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                To empower developers and designers to build stunning web
                experiences with modern tools and best practices. We believe in
                the power of smooth transitions, beautiful design, and
                exceptional user experience.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200">
              <h2 className="text-3xl font-bold mb-4 text-slate-900">
                What We Do
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                We specialize in creating modern web applications with:
              </p>
              <ul className="space-y-3 text-lg text-slate-600">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-3">✓</span>
                  <span>
                    Smooth page transitions using Swup for seamless navigation
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-3">✓</span>
                  <span>
                    Beautiful, modern UI/UX with attention to detail
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-3">✓</span>
                  <span>
                    Performance optimization for lightning-fast experiences
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-3">✓</span>
                  <span>Responsive design that works on all devices</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
              <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
              <p className="text-lg opacity-90 leading-relaxed mb-6">
                We're constantly evolving and improving. Join us in building the
                future of web experiences.
              </p>
              <Button
                variant="primary"
                href="/contact"
                className="px-8 py-4 text-lg bg-white text-indigo-600 hover:bg-white/90"
              >
                Get in Touch
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}

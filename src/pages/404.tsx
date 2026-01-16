import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import Section from "@/components/Section";
import Button from "@/components/Button";

export default function Custom404() {
    return (
        <PageLayout>
            <Section padding="large" className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-xl mx-auto px-4">
                    {/* 404 Number with Gradient */}
                    <div className="relative mb-8">
                        <h1 className="text-[150px] sm:text-[200px] font-bold leading-none bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                            404
                        </h1>
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-500/20 blur-3xl -z-10"></div>
                    </div>

                    {/* Message */}
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
                        Oops! Page Not Found
                    </h2>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">
                        The page you're looking for doesn't exist or has been moved.
                        Let's get you back on track.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button href="/" variant="primary">
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Back to Home
                            </span>
                        </Button>
                        <Button href="/contact" variant="secondary">
                            Contact Support
                        </Button>
                    </div>

                    {/* Decorative Elements */}
                    <div className="mt-16 flex items-center justify-center gap-2 text-slate-400">
                        <span className="w-12 h-px bg-slate-200"></span>
                        <span className="text-sm">or try these links</span>
                        <span className="w-12 h-px bg-slate-200"></span>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
                        <Link href="/about" className="text-indigo-600 hover:text-indigo-700 hover:underline">
                            About Us
                        </Link>
                        <span className="text-slate-300">•</span>
                        <Link href="/gallery" className="text-indigo-600 hover:text-indigo-700 hover:underline">
                            Gallery
                        </Link>
                        <span className="text-slate-300">•</span>
                        <Link href="/vistara" className="text-indigo-600 hover:text-indigo-700 hover:underline">
                            Vistara
                        </Link>
                        <span className="text-slate-300">•</span>
                        <Link href="/contact" className="text-indigo-600 hover:text-indigo-700 hover:underline">
                            Contact
                        </Link>
                    </div>
                </div>
            </Section>
        </PageLayout>
    );
}

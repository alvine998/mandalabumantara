import PageLayout from "@/components/PageLayout";
import Section from "@/components/Section";
import Button from "@/components/Button";

export default function Vistara() {
    const businessDivisions = [
        {
            icon: "💼",
            title: "Vistara Konsultan",
            description: "Layanan konsultasi properti profesional untuk investasi, pengembangan, dan manajemen aset properti yang optimal."
        },
        {
            icon: "👷",
            title: "Vistara Kontraktor",
            description: "Jasa konstruksi dan pembangunan dengan standar kualitas tinggi, tepat waktu, dan sesuai anggaran."
        },
        {
            icon: "🏗️",
            title: "Vistara Developer",
            description: "Pengembangan properti modern yang inovatif dengan desain berkelas dan lokasi strategis."
        },
        {
            icon: "📦",
            title: "Vistara Material",
            description: "Penyedia material bangunan berkualitas premium dengan harga kompetitif dan pengiriman tepat waktu."
        },
        {
            icon: "🏠",
            title: "Vistara Home Service",
            description: "Layanan perawatan dan perbaikan rumah profesional untuk kenyamanan hunian Anda."
        }
    ];

    const projectHighlights = [
        { number: "500+", label: "Unit Terjual" },
        { number: "50+", label: "Proyek Selesai" },
        { number: "98%", label: "Kepuasan Klien" },
        { number: "15+", label: "Tahun Pengalaman" }
    ];

    const features = [
        {
            icon: "🎯",
            title: "Lokasi Strategis",
            description: "Properti berlokasi di area premium dengan akses mudah ke pusat bisnis, pendidikan, dan fasilitas umum."
        },
        {
            icon: "🏆",
            title: "Kualitas Terjamin",
            description: "Standar konstruksi internasional dengan material berkualitas tinggi dan pengawasan ketat."
        },
        {
            icon: "💎",
            title: "Desain Modern",
            description: "Arsitektur kontemporer yang memadukan estetika, fungsionalitas, dan kenyamanan."
        },
        {
            icon: "📈",
            title: "Investasi Menguntungkan",
            description: "Nilai properti yang terus meningkat dengan ROI yang menarik untuk investor."
        }
    ];

    return (
        <PageLayout activePage="home">
            {/* Hero Section */}
            <Section padding="large">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-block mb-4 px-4 py-2 bg-sky-100 rounded-full border border-sky-200">
                                <span className="text-sm font-medium text-sky-700">
                                    🏢 Proyek Mandala Bumi Nusantara
                                </span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-blue-900 via-blue-800 to-blue-500 bg-clip-text text-transparent">
                                <span>
                                    Vistara
                                </span>
                                <br />
                                <span>Property Excellence</span>
                            </h1>
                            <p className="text-xl text-slate-600 mb-4 leading-relaxed">
                                Proyek properti terintegrasi dari <strong>Mandala Bumi Nusantara</strong> yang menghadirkan
                                solusi lengkap untuk kebutuhan properti Anda.
                            </p>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Dari konsultasi hingga perawatan, kami menyediakan layanan end-to-end dengan
                                standar kualitas terbaik dan komitmen kepada kepuasan pelanggan.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button variant="primary" className="px-8 py-4 text-lg bg-gradient-to-r from-sky-600 to-blue-600">
                                    Lihat Proyek
                                </Button>
                                <Button variant="secondary" className="px-8 py-4 text-lg">
                                    Hubungi Kami
                                </Button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50">
                                <div className="w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center">
                                    <div className="text-center text-white p-8">
                                        <div className="text-8xl mb-4">🏢</div>
                                        <p className="text-2xl font-bold">Vistara</p>
                                        <p className="text-lg opacity-90 mt-2">Properti Berkelas</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-sky-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-40 animate-pulse delay-1000"></div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Stats Section */}
            <Section background="light">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {projectHighlights.map((stat, index) => (
                            <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
                                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-900 to-amber-500 bg-clip-text text-transparent mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-slate-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Business Divisions Section */}
            <Section>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-900">
                            Divisi Bisnis Vistara
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Lima divisi terintegrasi yang memberikan solusi properti menyeluruh dari hulu ke hilir
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {businessDivisions.map((division, index) => (
                            <div key={index} className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-amber-500 hover:shadow-xl transition-all duration-300 group">
                                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{division.icon}</div>
                                <h3 className="text-2xl font-bold mb-3 text-slate-900">{division.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{division.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Features Section */}
            <Section background="light">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-900">
                            Keunggulan Vistara
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Mengapa Vistara menjadi pilihan terbaik untuk investasi dan hunian impian Anda
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-amber-500 hover:shadow-xl transition-all duration-300 group">
                                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                                <h3 className="text-2xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Integration Info Section */}
            <Section>
                <div className="max-w-7xl mx-auto">
                    <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-3xl p-8 md:p-12 border border-sky-200">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">
                                Solusi Terintegrasi
                            </h2>
                            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                                Dengan lima divisi bisnis yang saling mendukung, Vistara memberikan pengalaman properti yang seamless
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-sky-200">
                                <div className="text-3xl mb-3">🔄</div>
                                <h3 className="text-lg font-bold mb-2 text-slate-900">One-Stop Solution</h3>
                                <p className="text-sm text-slate-600">Semua kebutuhan properti dalam satu ekosistem terpadu</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-sky-200">
                                <div className="text-3xl mb-3">⚡</div>
                                <h3 className="text-lg font-bold mb-2 text-slate-900">Efisiensi Maksimal</h3>
                                <p className="text-sm text-slate-600">Koordinasi antar divisi yang optimal untuk hasil terbaik</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-sky-200">
                                <div className="text-3xl mb-3">💰</div>
                                <h3 className="text-lg font-bold mb-2 text-slate-900">Nilai Terbaik</h3>
                                <p className="text-sm text-slate-600">Harga kompetitif dengan kualitas premium</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* CTA Section */}
            <Section background="light">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="p-12 rounded-3xl bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 text-white">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                            Wujudkan Impian Properti Anda
                        </h2>
                        <p className="text-xl mb-8 opacity-90">
                            Bergabunglah dengan ratusan klien yang telah mempercayai Vistara untuk investasi dan hunian mereka.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button variant="primary" className="px-8 py-4 text-lg bg-white text-blue-900 hover:bg-white/90">
                                Jadwalkan Konsultasi
                            </Button>
                            <Button variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white/10">
                                Download Brosur
                            </Button>
                        </div>
                    </div>
                </div>
            </Section>
        </PageLayout>
    );
}

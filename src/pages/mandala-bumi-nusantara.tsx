import PageLayout from "@/components/PageLayout";
import Section from "@/components/Section";
import Button from "@/components/Button";

export default function MandalaBumiNusantara() {
    const businessUnits = [
        {
            icon: "�️",
            title: "Developer",
            description: "Fokus utama pada pengembangan dan penjualan properti."
        },
        {
            icon: "🎨",
            title: "Bisnis Interior",
            description: "Menawarkan layanan desain dan konstruksi interior untuk meningkatkan nilai properti."
        },
        {
            icon: "👷",
            title: "Kontraktor",
            description: "Melaksanakan pembangunan fisik, infrastruktur, atau renovasi."
        },
        {
            icon: "💼",
            title: "Konsultan Properti",
            description: "Memberikan saran ahli tentang investasi, pengembangan, dan manajemen properti."
        },
        {
            icon: "📦",
            title: "Penyedia Material",
            description: "Mengintegrasikan pasokan material untuk mengoptimalkan biaya dan rantai pasokan."
        },
        {
            icon: "�",
            title: "Home Service",
            description: "Menyediakan layanan rumahan yang berfokus pada kemudahan dan kualitas untuk pelanggan, seperti perbaikan rumah yang dirancang untuk memenuhi kebutuhan gaya hidup modern yang sibuk."
        }
    ];

    const businessFocus = [
        {
            stat: "23x",
            label: "Lebih berpeluang mendapatkan pelanggan",
            description: "Perusahaan berbasis data"
        },
        {
            stat: "6x",
            label: "Lebih berpeluang membuat pelanggan loyal",
            description: "Dengan sistem yang kokoh"
        },
        {
            stat: "19x",
            label: "Lebih berpeluang untuk lebih untung",
            description: "McKinsey Global Institute"
        }
    ];

    return (
        <PageLayout activePage="home">
            {/* Hero Section */}
            <Section padding="large">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-block mb-4 px-4 py-2 bg-amber-100 rounded-full border border-amber-200">
                                <span className="text-sm font-medium text-amber-700">
                                    🇮🇩 Pembangunan Nasional Berkarakter
                                </span>
                            </div>
                            <h1 className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-300 bg-clip-text text-transparent text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                <span>
                                    Mandala
                                </span>
                                <br />
                                <span>Bumantara</span>
                            </h1>
                            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                                Dalam bahasa Sansekerta, <strong>Mandala</strong> secara harfiah berarti "lingkaran" atau "pusat".
                                Mandala melambangkan alam semesta, pergerakan dinamis, dan perjalanan spiritual dalam mencapai kesempurnaan.
                            </p>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                <strong>Bumantara</strong> adalah penegasan dari Bumi Nusantara. Kita semua menyadari betapa kaya dan luasnya
                                Nusantara Indonesia. Jutaan hektar lahan potensial siap untuk dikembangkan.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button variant="primary" className="px-8 py-4 text-lg bg-gradient-to-r from-amber-600 to-orange-600">
                                    Jelajahi Proyek
                                </Button>
                                <Button variant="secondary" className="px-8 py-4 text-lg">
                                    Hubungi Kami
                                </Button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50">
                                <div className="w-full h-full bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 flex items-center justify-center">
                                    <div className="text-center text-white p-8">
                                        <div className="text-8xl mb-4">�️</div>
                                        <p className="text-2xl font-bold">Mandala</p>
                                        <p className="text-lg opacity-90 mt-2">Lingkaran Kesempurnaan</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-orange-200 rounded-full blur-3xl opacity-40 animate-pulse delay-1000"></div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Business Units Section */}
            <Section background="light">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-900">
                            Business Unit
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Layanan terintegrasi untuk memenuhi kebutuhan properti Anda secara menyeluruh
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {businessUnits.map((unit, index) => (
                            <div key={index} className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-xl transition-all duration-300 group">
                                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{unit.icon}</div>
                                <h3 className="text-2xl font-bold mb-3 text-slate-900">{unit.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{unit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Business Focus Section */}
            <Section>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-900">
                            Business Focus
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
                            Dengan adanya sistem yang kokoh, perusahaan akan terstruktur, efisien, dan siap untuk tumbuh
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {businessFocus.map((item, index) => (
                            <div key={index} className="text-center p-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 hover:shadow-lg transition-all">
                                <div className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3">
                                    {item.stat}
                                </div>
                                <div className="text-lg font-semibold text-slate-900 mb-2">{item.label}</div>
                                <div className="text-sm text-slate-600">{item.description}</div>
                            </div>
                        ))}
                    </div>

                    {/* Focus Points */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-xl transition-all duration-300">
                            <div className="text-4xl mb-4">📊</div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">Berbasis Data</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Mengintegrasikan perangkat lunak, analisis data digital dan teknologi ke dalam setiap aspek operasional dan model bisnis.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-xl transition-all duration-300">
                            <div className="text-4xl mb-4">🔄</div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">Transformasi Digital</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Mengintegrasikan teknologi digital ke dalam setiap aspek bisnis untuk meningkatkan efisiensi dan nilai pelanggan.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-xl transition-all duration-300">
                            <div className="text-4xl mb-4">🛡️</div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">Mitigasi Risiko</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Struktur dan proses yang secara sistematis mampu mengidentifikasi akar masalah, menemukan solusi inovatif, dan mengimplementasikan perubahan secara efektif.
                            </p>
                        </div>
                    </div>
                </div>
            </Section>

            {/* CTA Section */}
            <Section background="light">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="p-12 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                            Bergabunglah Dengan Kami
                        </h2>
                        <p className="text-xl mb-8 opacity-90">
                            Mari bersama membangun Indonesia yang lebih baik melalui pembangunan properti yang berkarakter dan berkelanjutan.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button variant="primary" className="px-8 py-4 text-lg bg-white text-amber-600 hover:bg-white/90">
                                Mulai Konsultasi
                            </Button>
                            <Button variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white/10">
                                Lihat Portfolio
                            </Button>
                        </div>
                    </div>
                </div>
            </Section>
        </PageLayout>
    );
}

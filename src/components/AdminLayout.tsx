import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import localFont from "next/font/local";

const geistSans = localFont({
    src: "../pages/fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});

const geistMono = localFont({
    src: "../pages/fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-slate-50 flex`}>
            <Sidebar />
            <div className="flex-1 ml-64">
                <Topbar />
                <main className="mt-16 p-8" data-swup>
                    {children}
                </main>
            </div>
        </div>
    );
}

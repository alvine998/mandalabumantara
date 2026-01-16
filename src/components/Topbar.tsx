import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

interface TopbarProps {
    className?: string;
    title?: string;
}

export default function Topbar({ className = "", title }: TopbarProps) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { user, signOut } = useAuth();
    const { showToast } = useToast();

    // Get page title from route
    const getPageTitle = () => {
        if (title) return title;
        const path = router.pathname;
        const segments = path.split("/").filter(Boolean);
        const lastSegment = segments[segments.length - 1] || "Dashboard";
        return lastSegment
            .replace(/[-_]/g, " ")
            .replace(/\[.*\]/g, "")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ") || "Dashboard";
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus search input when opened
    useEffect(() => {
        if (showSearch && searchRef.current) {
            searchRef.current.focus();
        }
    }, [showSearch]);

    const handleSignOut = async () => {
        try {
            await signOut();
            showToast("Successfully signed out", "success");
            router.push("/login");
        } catch (error) {
            showToast("Failed to sign out", "error");
        }
    };

    const getUserInitials = () => {
        if (user?.displayName) {
            return user.displayName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);
        }
        if (user?.email) {
            return user.email.slice(0, 2).toUpperCase();
        }
        return "AD";
    };

    return (
        <header
            className={`fixed top-0 right-0 left-64 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-40 flex items-center justify-between px-8 transition-all duration-300 ${className}`}
        >
            {/* Left Section - Page Title & Breadcrumb */}
            <div className="flex items-center space-x-4">
                <div>
                    <h2 className="text-lg font-semibold text-slate-800">{getPageTitle()}</h2>
                    <p className="text-xs text-slate-400">
                        {new Date().toLocaleDateString("id-ID", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                    {showSearch ? (
                        <div className="flex items-center">
                            <input
                                ref={searchRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search..."
                                className="w-64 px-4 py-2 text-sm rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white"
                                onBlur={() => {
                                    if (!searchQuery) setShowSearch(false);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Escape") {
                                        setShowSearch(false);
                                        setSearchQuery("");
                                    }
                                }}
                            />
                            <button
                                onClick={() => {
                                    setShowSearch(false);
                                    setSearchQuery("");
                                }}
                                className="ml-2 p-2 text-slate-400 hover:text-slate-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowSearch(true)}
                            className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Notifications */}
                <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                </button>

                <div className="h-8 w-px bg-slate-200"></div>

                {/* User Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center space-x-3 cursor-pointer group"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                                {user?.displayName || user?.email?.split("@")[0] || "Admin"}
                            </p>
                            <p className="text-xs text-slate-500">Administrator</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-0.5 ring-2 ring-transparent group-hover:ring-indigo-500/20 transition-all">
                            <div className="w-full h-full rounded-full bg-slate-50 border-2 border-white flex items-center justify-center overflow-hidden">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-sm font-bold text-indigo-600">{getUserInitials()}</span>
                                )}
                            </div>
                        </div>
                        <svg
                            className={`w-4 h-4 text-slate-400 transition-transform ${showDropdown ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 animate-fade-in">
                            <div className="px-4 py-3 border-b border-slate-100">
                                <p className="text-sm font-medium text-slate-700">{user?.displayName || "Admin"}</p>
                                <p className="text-xs text-slate-500 truncate">{user?.email || "admin@example.com"}</p>
                            </div>

                            <div className="py-2">
                                <button
                                    onClick={() => {
                                        setShowDropdown(false);
                                        router.push("/main/profile");
                                    }}
                                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>Profile</span>
                                </button>

                                <button
                                    onClick={() => {
                                        setShowDropdown(false);
                                        router.push("/main/settings");
                                    }}
                                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>Settings</span>
                                </button>
                            </div>

                            <div className="border-t border-slate-100 pt-2">
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

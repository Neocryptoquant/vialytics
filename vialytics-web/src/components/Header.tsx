"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import dynamic from "next/dynamic";

const WalletMultiButton = dynamic(
    async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
);

export default function Header() {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8 relative">
                    <img src="/logo.png" alt="Vialytics Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-orange-500 font-display">
                    Vialytics
                </span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
                <Link href="/markets" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    Markets
                </Link>
                <Link href="/network" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    Network
                </Link>
                <Link href="/dashboard" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    Dashboard
                </Link>
            </nav>

            <div className="flex items-center space-x-4">
                <WalletMultiButton style={{ padding: '0 24px', height: '40px', fontSize: '14px', fontWeight: '600', borderRadius: '8px', backgroundColor: '#9333ea' }} />
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                    <Settings className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}

import { useState } from "react";
import { useParams } from "react-router-dom";
import { Search, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ModeToggle";
import Avatar from "@/components/ui/avatar";

export function Header() {
    const { wallet } = useParams<{ wallet: string }>();
    const [searchInput, setSearchInput] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            // Open in new tab
            window.open(`https://orb.helius.dev/address/${searchInput.trim()}`, '_blank', 'noopener,noreferrer');
            setSearchInput("");
        }
    };

    return (
        <header className="h-20 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
            {/* Logo */}
            <div className="flex items-center gap-3">
                <Avatar svg="/vialyticsSvg.svg" jpg="/vialytics-logo.jpg" alt="Vialytics" className="w-10 h-10 object-contain" />
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent tracking-tight">Vialytics</span>
            </div>

            {/* Search Bar - Link to Helius */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <img src="/poweredByHelius.svg" alt="Helius" className="h-5 w-5" />
                    </div>
                    <Input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full h-12 pl-12 pr-12 bg-slate-50/50 border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-200 transition-all text-slate-600 placeholder:text-slate-400 font-medium"
                        placeholder="Search the blockchain explorer for addresses..."
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <ExternalLink className="h-4 w-4 text-slate-400" />
                    </div>
                </div>
            </form>

            {/* Mode Toggle & Status */}
            <div className="flex items-center gap-4">
                <ModeToggle />

                <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full border border-orange-100 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    <span className="text-sm font-semibold text-orange-700">Triton RPC: Active</span>
                </div>
            </div>
        </header>
    );
}

import { Search, Sprout } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ModeToggle";

export function Header() {
    return (
        <header className="h-20 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
            {/* Logo */}
            <div className="flex items-center gap-3">
                <img src="/vialytics-logo.jpg" alt="Vialytics" className="w-10 h-10 object-contain" />
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent tracking-tight">Vialytics</span>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Sprout className="h-5 w-5 text-indigo-500" />
                    </div>
                    <Input
                        className="w-full h-12 pl-12 pr-4 bg-slate-50/50 border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-200 transition-all text-slate-600 placeholder:text-slate-400 font-medium"
                        placeholder="Ask me anything about your crypto..."
                    />
                </div>
            </div>

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

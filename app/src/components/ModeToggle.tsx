import { Moon, Zap } from "lucide-react";
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

type Mode = "noob" | "founder";

interface ModeContextType {
    mode: Mode;
    toggleMode: () => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<Mode>("noob");
    const [showComingSoon, setShowComingSoon] = useState(false);

    const toggleMode = () => {
        // Founder mode is coming soon - show popup
        setShowComingSoon(true);
        setTimeout(() => setShowComingSoon(false), 2000);
    };

    return (
        <ModeContext.Provider value={{ mode, toggleMode }}>
            {children}
            {showComingSoon && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4 animate-pulse">
                        <Zap className="mx-auto text-purple-600 mb-4" size={48} />
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">Founder Mode</h3>
                        <p className="text-slate-600">Coming Soon!</p>
                        <p className="text-sm text-slate-400 mt-2">Team analytics & advanced features</p>
                    </div>
                </div>
            )}
        </ModeContext.Provider>
    );
}

export function useMode() {
    const context = useContext(ModeContext);
    if (!context) {
        throw new Error("useMode must be used within ModeProvider");
    }
    return context.mode;
}

export function ModeToggle() {
    const context = useContext(ModeContext);
    if (!context) {
        throw new Error("ModeToggle must be used within ModeProvider");
    }

    const { mode, toggleMode } = context;

    return (
        <button
            onClick={toggleMode}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            title="Switch to Founder Mode"
        >
            <Moon size={16} />
            <span className="text-sm font-semibold">Noob Mode</span>
        </button>
    );
}

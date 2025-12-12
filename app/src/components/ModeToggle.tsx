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
    const [mode, setMode] = useState<Mode>(() => {
        if (typeof window !== "undefined") {
            return (localStorage.getItem("vialytics-mode") as Mode) || "noob";
        }
        return "noob";
    });

    const toggleMode = () => {
        setMode((prev) => {
            const newMode = prev === "noob" ? "founder" : "noob";
            localStorage.setItem("vialytics-mode", newMode);
            return newMode;
        });
    };

    return (
        <ModeContext.Provider value={{ mode, toggleMode }}>
            {children}
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
            title={mode === "noob" ? "Switch to Founder Mode" : "Switch to Noob Mode"}
        >
            {mode === "noob" ? (
                <>
                    <Moon size={16} />
                    <span className="text-sm font-semibold">Noob Mode</span>
                </>
            ) : (
                <>
                    <Zap size={16} />
                    <span className="text-sm font-semibold">Founder Mode</span>
                </>
            )}
        </button>
    );
}

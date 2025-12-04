"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function PromptInput() {
    return (
        <div className="relative w-full max-w-2xl">
            <div className="relative rounded-xl p-[2px] overflow-hidden">
                {/* Animated Gradient Border */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-purple to-primary-orange animate-gradient-xy opacity-75 blur-sm" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-purple to-primary-orange animate-gradient-xy" />

                <div className="relative flex items-center bg-white dark:bg-gray-900 rounded-[10px] pr-2">
                    <input
                        type="text"
                        placeholder="Ask about your wallet history..."
                        className="w-full bg-transparent px-6 py-4 text-lg outline-none placeholder:text-gray-400 dark:text-white"
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-primary-purple to-primary-orange text-white shadow-lg hover:opacity-90 transition-opacity"
                    >
                        <ArrowRight className="h-5 w-5" />
                    </motion.button>
                </div>
            </div>
        </div>
    );
}

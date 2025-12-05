"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface PromptInputProps {
  onSubmit: (query: string) => Promise<void>;
  isLoading?: boolean;
}

export function PromptInput({ onSubmit, isLoading = false }: PromptInputProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = async () => {
    if (!query.trim() || isLoading) return;
    await onSubmit(query);
    setQuery("");
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative rounded-xl p-[2px] overflow-hidden">
        {/* Animated Gradient Border */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-purple to-primary-orange animate-gradient-xy opacity-75 blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-purple to-primary-orange animate-gradient-xy" />

        <div className="relative flex items-center bg-white dark:bg-gray-900 rounded-[10px] pr-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Ask about your wallet history..."
            className="w-full bg-transparent px-6 py-4 text-lg outline-none placeholder:text-gray-400 dark:text-white"
            disabled={isLoading}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-primary-purple to-primary-orange text-white shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

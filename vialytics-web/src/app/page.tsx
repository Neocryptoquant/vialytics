"use client";

import { motion } from "framer-motion";
import { Activity, Wallet, BarChart3 } from "lucide-react";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8 sm:p-20 font-[family-name:var(--font-space-grotesk)]">
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col gap-8 items-center text-center max-w-4xl w-full"
      >
        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl sm:text-7xl font-bold tracking-tighter font-display bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500"
          >
            Vialytics
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Your wallet's story, told through beautiful data.
            <br className="hidden sm:block" />
            Connect, chat, and visualize your Solana journey.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="w-full max-w-3xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-800 p-1"
        >
          <ChatInterface />
        </motion.div>


      </motion.main>
    </div>
  );
}

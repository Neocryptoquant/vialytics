"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export function TokenFlowSankey() {
    const [hoveredLink, setHoveredLink] = useState<number | null>(null);

    return (
        <div className="w-full overflow-hidden bg-white p-6 shadow-sm dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Token Flow</h2>
                <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-md text-sm mt-2 sm:mt-0">
                    <button className="px-3 py-1 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">1H</button>
                    <button className="px-3 py-1 rounded-md bg-white dark:bg-gray-700 text-primary-purple font-semibold shadow-sm">24H</button>
                    <button className="px-3 py-1 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">7D</button>
                </div>
            </div>

            <div className="relative w-full h-[400px] flex justify-center">
                <svg viewBox="0 0 1000 500" className="w-full h-full max-w-5xl">
                    <defs>
                        <linearGradient id="purpleGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                            <stop offset="0%" stopColor="#8A2BE2" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.8" />
                        </linearGradient>
                        <linearGradient id="orangeGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                            <stop offset="0%" stopColor="#CC5500" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#FB923C" stopOpacity="0.8" />
                        </linearGradient>
                        <linearGradient id="redGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#FCA5A5" stopOpacity="0.8" />
                        </linearGradient>
                    </defs>

                    {/* Links */}
                    <g className="sankey-links">
                        <motion.path
                            d="M 120 105 C 500 105, 500 120, 880 120"
                            stroke="url(#purpleGradient)"
                            strokeWidth="30"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5 }}
                            onMouseEnter={() => setHoveredLink(1)}
                            onMouseLeave={() => setHoveredLink(null)}
                            className={`transition-opacity duration-300 ${hoveredLink === 1 ? "opacity-100" : "opacity-70"}`}
                        />
                        <motion.path
                            d="M 120 250 C 500 250, 500 220, 880 220"
                            stroke="url(#purpleGradient)"
                            strokeWidth="50"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, delay: 0.2 }}
                            onMouseEnter={() => setHoveredLink(2)}
                            onMouseLeave={() => setHoveredLink(null)}
                            className={`transition-opacity duration-300 ${hoveredLink === 2 ? "opacity-100" : "opacity-70"}`}
                        />
                        <motion.path
                            d="M 120 410 C 500 410, 500 405, 880 405"
                            stroke="url(#orangeGradient)"
                            strokeWidth="40"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, delay: 0.4 }}
                            onMouseEnter={() => setHoveredLink(3)}
                            onMouseLeave={() => setHoveredLink(null)}
                            className={`transition-opacity duration-300 ${hoveredLink === 3 ? "opacity-100" : "opacity-70"}`}
                        />
                        <motion.path
                            d="M 120 280 C 500 280, 500 315, 880 315"
                            stroke="url(#redGradient)"
                            strokeWidth="25"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, delay: 0.6 }}
                            onMouseEnter={() => setHoveredLink(4)}
                            onMouseLeave={() => setHoveredLink(null)}
                            className={`transition-opacity duration-300 ${hoveredLink === 4 ? "opacity-100" : "opacity-70"}`}
                        />
                    </g>

                    {/* Nodes */}
                    <g transform="translate(10, 80)">
                        <rect fill="#8A2BE2" height="50" rx="3" width="10" />
                        <text className="fill-gray-700 dark:fill-gray-300 font-semibold text-sm" x="15" y="30">Mint Received</text>
                    </g>
                    <g transform="translate(10, 225)">
                        <rect fill="#8A2BE2" height="80" rx="3" width="10" />
                        <text className="fill-gray-700 dark:fill-gray-300 font-semibold text-sm" x="15" y="45">Source Wallet</text>
                    </g>
                    <g transform="translate(980, 100)">
                        <rect fill="#CC5500" height="150" rx="3" width="10" />
                        <text className="fill-gray-700 dark:fill-gray-300 font-semibold text-sm" textAnchor="end" x="-15" y="80">DEX Interaction</text>
                    </g>
                    <g transform="translate(980, 295)">
                        <rect fill="#EF4444" height="130" rx="3" width="10" />
                        <text className="fill-gray-700 dark:fill-gray-300 font-semibold text-sm" textAnchor="end" x="-15" y="70">Destination Wallet</text>
                    </g>
                </svg>
            </div>
        </div>
    );
}

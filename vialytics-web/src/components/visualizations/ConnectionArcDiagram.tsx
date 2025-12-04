"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface Connection {
    id: string;
    name: string;
    type: "frequent" | "high-value";
    radius: number;
    startAngle: number;
    endAngle: number;
}

const connections: Connection[] = [
    { id: "1", name: "Magic Eden", type: "frequent", radius: 320, startAngle: 0, endAngle: 180 },
    { id: "2", name: "Solend", type: "frequent", radius: 240, startAngle: 0, endAngle: 180 },
    { id: "3", name: "Tensor", type: "high-value", radius: 160, startAngle: 0, endAngle: 180 },
    { id: "4", name: "Raydium", type: "frequent", radius: 80, startAngle: 0, endAngle: 180 },
    { id: "5", name: "Jupiter", type: "frequent", radius: 80, startAngle: 180, endAngle: 360 },
    { id: "6", name: "Orca", type: "high-value", radius: 160, startAngle: 180, endAngle: 360 },
    { id: "7", name: "Friend.tech", type: "frequent", radius: 240, startAngle: 180, endAngle: 360 },
    { id: "8", name: "Wormhole", type: "high-value", radius: 320, startAngle: 180, endAngle: 360 },
];

export function ConnectionArcDiagram() {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    return (
        <div className="w-full overflow-hidden bg-white p-6 shadow-sm dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Wallet Interactions</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Based on the last 7 days</p>
                </div>
                <div className="flex space-x-4">
                    <div className="flex items-center space-x-2 text-sm">
                        <span className="h-3 w-3 rounded-full bg-primary-purple" />
                        <span className="text-gray-600 dark:text-gray-300">Frequent</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                        <span className="h-3 w-3 rounded-full bg-primary-orange" />
                        <span className="text-gray-600 dark:text-gray-300">High Value</span>
                    </div>
                </div>
            </div>

            <div className="relative flex justify-center">
                <svg viewBox="0 0 800 350" className="w-full max-w-4xl">
                    {/* Base Line */}
                    <line x1="20" y1="300" x2="780" y2="300" stroke="currentColor" strokeWidth="1" className="text-gray-200 dark:text-gray-700" />

                    {/* Center Node (User Wallet) */}
                    <g transform="translate(400, 300)">
                        <motion.circle
                            r="16"
                            className="fill-primary-purple/20"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <circle r="12" className="fill-white dark:fill-gray-900" />
                        <circle r="8" className="fill-primary-purple" />
                        <text y="40" textAnchor="middle" className="fill-gray-900 text-sm font-semibold dark:fill-white">
                            User Wallet
                        </text>
                    </g>

                    {/* Arcs and Nodes */}
                    {connections.map((conn, index) => {
                        // Calculate node position
                        const isLeft = index < 4;
                        const xOffset = isLeft ? -conn.radius : conn.radius;
                        const arcPath = isLeft
                            ? `M 400 300 A ${conn.radius} ${conn.radius} 0 0 1 ${400 - conn.radius} 300`
                            : `M 400 300 A ${conn.radius} ${conn.radius} 0 0 0 ${400 + conn.radius} 300`;

                        const color = conn.type === "frequent" ? "text-primary-purple" : "text-primary-orange";
                        const isHovered = hoveredId === conn.id;

                        return (
                            <g key={conn.id} onMouseEnter={() => setHoveredId(conn.id)} onMouseLeave={() => setHoveredId(null)}>
                                <motion.path
                                    d={arcPath}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={isHovered ? 3 : 1.5}
                                    className={`transition-all duration-300 ${color} ${isHovered ? "opacity-100" : "opacity-60"}`}
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1, delay: index * 0.1 }}
                                />
                                <g transform={`translate(${400 + xOffset}, 300)`}>
                                    <motion.circle
                                        r={isHovered ? 8 : 6}
                                        className={`fill-current ${color} transition-all duration-300`}
                                    />
                                    <text
                                        y="25"
                                        textAnchor="middle"
                                        className={`text-xs transition-all duration-300 ${isHovered ? "fill-gray-900 font-semibold dark:fill-white" : "fill-gray-500 dark:fill-gray-400"}`}
                                    >
                                        {conn.name}
                                    </text>
                                </g>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}

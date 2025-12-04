"use client";

import { motion } from "framer-motion";
import { useState } from "react";

// Mock data generation
const generateData = () => {
    const data = [];
    const now = new Date();
    for (let i = 0; i < 365; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - (364 - i));
        const activityLevel = Math.floor(Math.random() * 5); // 0-4
        data.push({ date, activityLevel });
    }
    return data;
};

const activityColors = [
    "bg-gray-100 dark:bg-gray-800", // Level 0
    "bg-purple-100 dark:bg-purple-900/30", // Level 1
    "bg-purple-200 dark:bg-purple-800/50", // Level 2
    "bg-purple-300 dark:bg-purple-700/70", // Level 3
    "bg-primary-orange shadow-glow-orange", // Level 4 (High activity)
];

export function ActivityHeatmap() {
    const [data] = useState(generateData());
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div className="w-full bg-white p-6 shadow-sm dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Wallet Activity Rhythm</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>Less</span>
                    {activityColors.map((color, i) => (
                        <div key={i} className={`h-4 w-4 rounded-sm ${color}`} />
                    ))}
                    <span>More</span>
                </div>
            </div>

            <div className="grid grid-cols-[repeat(53,_minmax(0,_1fr))] grid-rows-7 gap-1">
                {data.map((day, index) => (
                    <div key={index} className="relative group">
                        <motion.div
                            className={`aspect-square rounded-sm ${activityColors[day.activityLevel]} cursor-pointer`}
                            whileHover={{ scale: 1.2, zIndex: 10 }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        />
                        {hoveredIndex === index && (
                            <div className="absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg dark:bg-white dark:text-gray-900">
                                {day.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}: {Math.floor(Math.random() * 50)} Txns
                                <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rotate-45 bg-gray-900 dark:bg-white" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

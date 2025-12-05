"use client";

import { ChevronRight } from "lucide-react";

export interface Transaction {
    id: string;
    type: "swap" | "send" | "receive" | "claim" | "bridge";
    description: string;
    time: string;
    status: "success" | "pending" | "failed";
    icon: string; // URL or placeholder
}

interface HistoryListProps {
    data?: Transaction[];
}

export function HistoryList({ data = [] }: HistoryListProps) {
    // Use passed data or fallback to empty (or mock if we wanted to keep it for testing)
    const displayData = data.length > 0 ? data : [];

    if (displayData.length === 0) {
        return (
            <div className="w-full bg-white shadow-sm dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-center text-gray-500">
                No transactions found.
            </div>
        );
    }

    return (
        <div className="w-full bg-white shadow-sm dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold px-6 pt-6 pb-4 text-gray-900 dark:text-white">Recent History</h2>
            <div className="space-y-2 px-4 pb-4">
                {displayData.map((tx, index) => (
                    <div
                        key={`${tx.id}-${index}`}
                        className="relative flex items-center p-4 space-x-4 bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                        {/* Status Indicator */}
                        <div
                            className={`absolute left-0 top-0 bottom-0 w-1 ${tx.status === "success"
                                ? "bg-primary-purple"
                                : tx.status === "pending"
                                    ? "bg-primary-orange"
                                    : "bg-red-500"
                                }`}
                        />

                        <div className="flex-shrink-0">
                            {/* Using a placeholder div if image fails, but trying to use the logo */}
                            <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                                <img src={tx.icon || "https://cryptologos.cc/logos/solana-sol-logo.png?v=029"} alt={tx.type} className="h-full w-full object-cover" />
                            </div>
                        </div>

                        <div className="flex-grow">
                            <p className="font-semibold text-gray-900 dark:text-white">{tx.description}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{tx.time}</p>
                        </div>

                        <div className="flex-shrink-0">
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

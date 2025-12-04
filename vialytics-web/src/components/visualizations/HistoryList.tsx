"use client";

import { ChevronRight } from "lucide-react";

interface Transaction {
    id: string;
    type: "swap" | "send" | "receive" | "claim" | "bridge";
    description: string;
    time: string;
    status: "success" | "pending" | "failed";
    icon: string; // URL or placeholder
}

const transactions: Transaction[] = [
    {
        id: "1",
        type: "swap",
        description: "Swapped SOL for JUP",
        time: "5 minutes ago",
        status: "success",
        icon: "https://cryptologos.cc/logos/solana-sol-logo.png?v=029",
    },
    {
        id: "2",
        type: "send",
        description: "Sent 50 USDC",
        time: "1 hour ago",
        status: "pending",
        icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=029",
    },
    {
        id: "3",
        type: "claim",
        description: "Claimed BONK airdrop",
        time: "2 hours ago",
        status: "success",
        icon: "https://cryptologos.cc/logos/bonk-bonk-logo.png?v=029",
    },
    {
        id: "4",
        type: "bridge",
        description: "Bridged ETH to SOL (Failed)",
        time: "yesterday",
        status: "failed",
        icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=029",
    },
    {
        id: "5",
        type: "receive",
        description: "Received 200 USDT",
        time: "2 days ago",
        status: "success",
        icon: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=029",
    },
];

export function HistoryList() {
    return (
        <div className="w-full bg-white shadow-sm dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold px-6 pt-6 pb-4 text-gray-900 dark:text-white">Recent History</h2>
            <div className="space-y-2 px-4 pb-4">
                {transactions.map((tx) => (
                    <div
                        key={tx.id}
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
                                <img src={tx.icon} alt={tx.type} className="h-full w-full object-cover" />
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

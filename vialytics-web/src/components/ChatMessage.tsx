"use client";

import { motion } from "framer-motion";
import { HistoryList, Transaction } from "@/components/visualizations/HistoryList";
import { ConnectionArcDiagram } from "@/components/visualizations/ConnectionArcDiagram";
import { TokenFlowSankey } from "@/components/visualizations/TokenFlowSankey";
import { ActivityHeatmap } from "@/components/visualizations/ActivityHeatmap";

export interface Message {
    role: "user" | "assistant";
    text: string;
    visualization?: {
        type: string;
        data: any;
        title: string;
    };
}

export function ChatMessage({ message }: { message: Message }) {
    const isUser = message.role === "user";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-6`}
        >
            <div className={`max-w-[80%] ${isUser ? "bg-primary-purple text-white" : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"} rounded-2xl p-4 shadow-sm`}>
                <p className="whitespace-pre-wrap">{message.text}</p>

                {message.visualization && (
                    <div className="mt-4">
                        {message.visualization.type === "list" && (
                            <HistoryList data={message.visualization.data as Transaction[]} />
                        )}
                        {message.visualization.type === "arc" && (
                            <ConnectionArcDiagram />
                        )}
                        {message.visualization.type === "sankey" && (
                            <TokenFlowSankey />
                        )}
                        {message.visualization.type === "heatmap" && (
                            <ActivityHeatmap />
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

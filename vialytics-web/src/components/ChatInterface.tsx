"use client";

import { useState, useRef, useEffect } from "react";
import { PromptInput } from "@/components/PromptInput";
import { ChatMessage, Message } from "@/components/ChatMessage";

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleQuery = async (query: string) => {
        // Add user message
        const userMsg: Message = { role: "user", text: query };
        setMessages((prev) => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:8000/api/chat/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: query }),
            });
            const data = await response.json();

            // Add AI response
            const aiMsg: Message = {
                role: "assistant",
                text: data.text,
                visualization: data.visualization,
            };
            setMessages((prev) => [...prev, aiMsg]);
        } catch (error) {
            console.error("Error:", error);
            const errorMsg: Message = {
                role: "assistant",
                text: "Sorry, I encountered an error connecting to the server.",
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full h-[600px] bg-white/50 dark:bg-gray-900/50 rounded-2xl overflow-hidden">
            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4">
                        <p className="text-lg">Ask about your wallet history...</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {["Visualize my gas spend", "Show my biggest inflows", "Who do I trade with most?"].map((prompt) => (
                                <button
                                    key={prompt}
                                    onClick={() => handleQuery(prompt)}
                                    className="px-4 py-2 text-sm bg-white dark:bg-gray-800 rounded-full hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {messages.map((msg, idx) => (
                    <ChatMessage key={idx} message={msg} />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                <PromptInput onSubmit={handleQuery} isLoading={isLoading} />
            </div>
        </div>
    );
}

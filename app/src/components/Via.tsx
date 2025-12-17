
import { useState, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WalletIntelligence } from "@/lib/ai-pipe";
import Avatar from "@/components/ui/avatar";
import { FormattedText } from "@/components/FormattedText";
import { endpoints } from "@/lib/api";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export function Via() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hey there! I'm Via - Ask me anything about your wallet!" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [analytics, setAnalytics] = useState<any>(null);

    // Fetch analytics when component mounts
    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                // Try to get wallet from URL
                const wallet = window.location.pathname.split('/').pop();
                if (wallet && wallet.length > 20) {
                    const response = await fetch(endpoints.analytics(wallet));
                    if (response.ok) {
                        const data = await response.json();
                        setAnalytics(data);
                    }
                }
            } catch (error) {
                console.log("Analytics not available yet");
            }
        };
        fetchAnalytics();
    }, []);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        // Fetch API key from server
        let apiKey = "";
        try {
            const configResponse = await fetch("/api/config");
            const config = await configResponse.json();
            apiKey = config.groqApiKey;
        } catch (error) {
            console.error("Failed to fetch config:", error);
        }

        // Fallback to client-side env var if not found in backend
        if (!apiKey) {
            apiKey = import.meta.env.VITE_GROQ_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || "";
        }

        // Debug logging
        console.log("[Via] Sending message:", userMessage.content);
        console.log("[Via] API Key:", apiKey ? "Loaded" : "Missing");

        if (!apiKey) {
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "API key not configured. Add VITE_GROQ_API_KEY to your .env file and restart."
            }]);
            setLoading(false);
            return;
        }

        try {
            const ai = new WalletIntelligence({
                apiKey: apiKey,
                provider: 'groq',
                model: 'llama-3.3-70b-versatile',
                analytics: analytics // Pass analytics as context
            });

            console.log("[Via] Calling AI...");
            const response = await ai.chat([...messages, userMessage]);
            console.log("[Via] AI Response:", response);

            setMessages(prev => [...prev, { role: "assistant", content: response }]);
        } catch (error) {
            console.error("[Via] AI Error:", error);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "Oops! Error calling Groq API. Check console for details."
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl transition-all duration-300 z-50",
                    "bg-gradient-to-br from-purple-500 to-orange-400 hover:scale-110 hover:shadow-purple-500/50",
                    "flex items-center justify-center",
                    isOpen && "scale-0"
                )}
            >
                <Avatar svg="/via-mascot.svg" jpg="/via-mascot.jpg" alt="Via" className="w-14 h-14 rounded-full object-cover border-2 border-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
            </button>

            {/* Chat Panel */}
            <Card className={cn(
                "fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl transition-all duration-300 z-50 flex flex-col",
                "border-none bg-white",
                isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
            )}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-500 to-orange-400">
                    <div className="flex items-center gap-3">
                        <Avatar svg="/via-mascot.svg" jpg="/via-mascot.jpg" alt="Via" className="w-10 h-10 rounded-full border-2 border-white" />
                        <div>
                            <h3 className="font-bold text-white">Chat with Via</h3>
                            <p className="text-xs text-white/80">Your AI Wallet Assistant</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(false)}
                        className="text-white hover:bg-white/20"
                    >
                        <X size={20} />
                    </Button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={cn(
                                "flex gap-2",
                                msg.role === "user" ? "justify-end" : "justify-start"
                            )}
                        >
                            {msg.role === "assistant" && (
                                <Avatar svg="/via-mascot.svg" jpg="/via-mascot.jpg" alt="Via" className="w-8 h-8 rounded-full flex-shrink-0" />
                            )}
                            <div
                                className={cn(
                                    "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                                    msg.role === "user"
                                        ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                                        : "bg-white border border-slate-200 text-slate-800"
                                )}
                            >
                                {msg.role === "assistant" ? (
                                    <FormattedText text={msg.content} />
                                ) : (
                                    msg.content
                                )}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex gap-2 justify-start">
                            <Avatar svg="/via-mascot.svg" jpg="/via-mascot.jpg" alt="Via" className="w-8 h-8 rounded-full" />
                            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="p-4 border-t bg-white">
                    <div className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Ask Via anything..."
                            className="flex-1"
                            disabled={loading}
                        />
                        <Button
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            className="bg-gradient-to-r from-purple-500 to-orange-400 hover:from-purple-600 hover:to-orange-500"
                        >
                            <Send size={18} />
                        </Button>
                    </div>
                </div>
            </Card>
        </>
    );
}

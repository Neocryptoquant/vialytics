import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Avatar from "@/components/ui/avatar";
import { Typewriter } from "@/components/Typewriter";
import { endpoints } from "@/lib/api";

export function LandingPage() {
    const [walletAddress, setWalletAddress] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateSolanaAddress = (address: string): boolean => {
        // Solana addresses are base58-encoded, 32-44 characters
        const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
        return base58Regex.test(address);
    };

    const handleAnalyze = async () => {
        setError("");

        if (!walletAddress.trim()) {
            setError("Please enter a wallet address");
            return;
        }

        if (!validateSolanaAddress(walletAddress)) {
            setError("Invalid Solana wallet address");
            return;
        }

        setLoading(true);

        try {
            // Check if analytics already exist in cache
            const cacheResponse = await fetch(endpoints.analytics(walletAddress));

            if (cacheResponse.ok) {
                // Analytics exist, go straight to dashboard
                navigate(`/dashboard/${walletAddress}`);
                return;
            }

            // Need to index - go to loading page
            navigate(`/loading/${walletAddress}`);
        } catch (err) {
            setError("Failed to connect to server. Make sure the API is running.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="w-full max-w-lg">
                {/* Simple Card */}
                <div className="bg-white rounded-3xl p-10 shadow-lg">

                    {/* Via Mascot - Simplified */}
                    <div className="flex justify-center mb-6">
                        <Avatar svg="/via-svg.svg" jpg="/via-mascot.jpg" alt="Via" className="w-32 h-32 rounded-full object-cover shadow-xl" />
                    </div>

                    {/* Title */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                            Vialytics
                        </h1>
                        <p className="text-slate-600">
                            Your personal Solana data analyst
                        </p>
                    </div>

                    {/* Wallet Input */}
                    <div className="space-y-4">
                        <div className="relative">
                            <Input
                                type="text"
                                value={walletAddress}
                                onChange={(e) => setWalletAddress(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleAnalyze()}
                                placeholder=""
                                className="h-14 px-4 text-base"
                                disabled={loading}
                            />
                            {!walletAddress && (
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <Typewriter
                                        words={[
                                            "Enter your Solana wallet address...",
                                            "Paste your wallet here...",
                                            "Drop your address to analyze...",
                                            "Start exploring your transactions..."
                                        ]}
                                        typingSpeed={80}
                                        deletingSpeed={40}
                                        delayBetweenWords={3000}
                                    />
                                </div>
                            )}
                        </div>
                        {error && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}

                        {/* CTA Button */}
                        <Button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="w-full h-14 text-base font-semibold bg-gradient-to-r from-purple-500 to-orange-400 hover:from-purple-600 hover:to-orange-500 text-white"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Checking...
                                </>
                            ) : (
                                <>
                                    {/* <Sparkles className="mr-2 h-5 w-5" /> */}
                                    Hey Via! Can you analyze My Wallet?
                                </>
                            )}
                        </Button>

                        {/* Info Text */}
                        <p className="text-center text-sm text-slate-500">
                            {/* We analyze your transactions to give you beginner-friendly insights */}
                            {/* Vialytics makes your analytics simple again  */}
                            Business Intelligence at your fingertips
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6 text-slate-400 text-sm">
                    Powered by Solana | Built by the Vialytics team
                </div>
            </div>
        </div>
    );
}

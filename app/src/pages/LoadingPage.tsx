import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Avatar from "@/components/ui/avatar";

export function LoadingPage() {
    const { wallet } = useParams<{ wallet: string }>();
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [jobId, setJobId] = useState<string | null>(null);

    const steps = [
        "Connecting to Solana network...",
        "Fetching transaction history...",
        "Analyzing token movements...",
        "Calculating portfolio metrics...",
        "Generating AI insights...",
        "Almost there..."
    ];

    useEffect(() => {
        if (!wallet) {
            navigate("/");
            return;
        }

        // Start indexing
        const startIndexing = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/index", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ wallet_address: wallet })
                });

                if (!response.ok) throw new Error("Failed to start indexing");

                const data = await response.json();
                setJobId(data.job_id);
            } catch (error) {
                console.error("Indexing error:", error);
                navigate("/");
            }
        };

        startIndexing();
    }, [wallet, navigate]);

    useEffect(() => {
        if (!jobId) return;

        // Poll for status
        const interval = setInterval(async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/index/status/${jobId}`);
                const data = await response.json();

                setProgress(data.progress || 0);
                setCurrentStep(Math.floor((data.progress / 100) * steps.length));

                if (data.status === "completed") {
                    clearInterval(interval);
                    setTimeout(() => navigate(`/dashboard/${wallet}`), 1000);
                } else if (data.status === "failed") {
                    clearInterval(interval);
                    alert("Failed to index wallet. Please try again.");
                    navigate("/");
                }
            } catch (error) {
                console.error("Status check error:", error);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [jobId, wallet, navigate, steps.length]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-orange-900 flex items-center justify-center p-6 overflow-hidden relative">
            {/* Animated Background Particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-white rounded-full opacity-20"
                        style={{
                            width: Math.random() * 4 + 2 + "px",
                            height: Math.random() * 4 + 2 + "px",
                            left: Math.random() * 100 + "%",
                            top: Math.random() * 100 + "%",
                            animation: `float ${Math.random() * 10 + 5}s infinite ease-in-out`,
                            animationDelay: Math.random() * 5 + "s"
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center max-w-2xl">
                {/* Mascot with Glow */}
                <div className="relative inline-block mb-12">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                    <Avatar
                        svg="/mascot.svg"
                        jpg="/via-mascot.jpg"
                        alt="Via"
                        className="relative w-48 h-48 rounded-full object-cover border-4 border-white shadow-2xl animate-spin-slow"
                        style={{ animation: "spin 20s linear infinite" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-64 h-64 text-white/30 animate-spin" />
                    </div>
                </div>

                {/* Status Text */}
                <h2 className="text-4xl font-bold text-white mb-4">
                    Via is cooking something special...
                </h2>
                <p className="text-2xl text-white/80 mb-12 font-medium">
                    {steps[currentStep] || steps[0]}
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-white/10 rounded-full h-4 mb-4 overflow-hidden backdrop-blur-sm">
                    <div
                        className="h-full bg-gradient-to-r from-purple-500 to-orange-400 transition-all duration-500 ease-out rounded-full"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <p className="text-white/60 text-sm">{Math.round(progress)}% complete</p>

                {/* Fun Fact */}
                <div className="mt-12 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                    <p className="text-white/70 text-sm italic">
                        💡 Did you know? Via analyzes your wallet in real-time to give you insights
                        that even crypto experts would envy.
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

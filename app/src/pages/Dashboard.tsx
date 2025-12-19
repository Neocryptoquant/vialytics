import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    ReferenceLine,
    XAxis,
    YAxis,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { Download, Sparkles, ArrowUpRight, ArrowDownLeft, Activity, Wallet, SpaceIcon, AtomIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { Via } from "@/components/Via";
import { SolanaNews } from "@/components/SolanaNews";
import { Typewriter } from "@/components/Typewriter";
import LabelInfo from "@/components/LabelInfo";
import { endpoints } from "@/lib/api";

type TimeRange = "7D" | "1M" | "3M" | "ALL";

export function Dashboard() {
    const { wallet } = useParams<{ wallet: string }>();
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<TimeRange>("1M");
    const [chartActiveName, setChartActiveName] = useState<string | null>(null);
    const [chartActiveValue, setChartActiveValue] = useState<number | null>(null);
    const [labelModalOpen, setLabelModalOpen] = useState(false);
    const [labelModalData, setLabelModalData] = useState<{ label?: string; address?: string }>({});

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!wallet) return;

            try {
                const response = await fetch(endpoints.analytics(wallet));
                if (!response.ok) {
                    throw new Error("Failed to fetch analytics");
                }
                const result = await response.json();

                // If data is only from Helius (not indexed), redirect to loading/indexer
                if (result.source === "helius" || result.data_source === "helius") {
                    navigate(`/loading/${wallet}`);
                    return;
                }

                setData(result);
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [wallet]);

    if (loading || !data) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading your analytics...</p>
                </div>
            </div>
        );
    }

    const portfolio = data.portfolio_overview;
    const earnings = data.earnings_spending;
    const activity = data.activity_insights;
    const enrichment = data.external_sources?.helius_orb ?? null;

    // Filter chart data by time range
    const filterDataByRange = (monthlyData: Record<string, number> | undefined) => {
        if (!monthlyData) return [];

        const entries = Object.entries(monthlyData).sort((a, b) => a[0].localeCompare(b[0]));
        const now = new Date();

        let filtered = entries;
        if (timeRange === "7D") {
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filtered = entries.filter(([month]) => new Date(month + "-01") >= sevenDaysAgo);
        } else if (timeRange === "1M") {
            const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            filtered = entries.filter(([month]) => new Date(month + "-01") >= oneMonthAgo);
        } else if (timeRange === "3M") {
            const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
            filtered = entries.filter(([month]) => new Date(month + "-01") >= threeMonthsAgo);
        }

        return filtered.map(([month, count]) => ({ name: month, value: count }));
    };

    const chartData = filterDataByRange(activity?.monthly_frequency);

    // Prefer helius normalized token balances when available, fallback to indexer portfolio tokens
    const tokenData = ((): any[] => {
        const norm = enrichment?.normalized;
        if (norm && Array.isArray(norm.token_balances) && norm.token_balances.length > 0) {
            return norm.token_balances.map((tb: any) => {
                const mint = tb.mint || "";
                const symbol = tb.symbol || getTokenLabel(mint);
                return { name: symbol, value: +(tb.ui_amount || 0), mint };
            });
        }
        return (portfolio?.top_tokens || []).filter((t: any) => t.amount > 0).map((t: any) => {
            const mint = t.mint || "";
            const symbol = t.symbol || t.token || getTokenLabel(mint);
            return { name: symbol, value: t.amount, mint };
        });
    })();

    // Helper to get token label from mint
    function getTokenLabel(mint: string): string {
        const knownTokens: Record<string, string> = {
            "So11111111111111111111111111111111111111112": "SOL",
            "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": "USDC",
            "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB": "USDT",
            "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So": "mSOL",
            "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263": "BONK",
            "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN": "JUP",
        };
        return knownTokens[mint] || (mint.length > 10 ? `${mint.slice(0, 4)}...${mint.slice(-4)}` : mint);
    }

    const COLORS = ['#8b5cf6', '#ec4899', '#f97316', '#06b6d4', '#10b981'];

    return (
        <div className="grid grid-cols-12 gap-6 p-6">
            <div className="col-span-12 lg:col-span-9 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                            Welcome, <Typewriter words={["Cypherpunkie", "DeFi Pioneer", "Buildoor", "Crypto Native", "Retar Dio"]} />
                        </h1>
                        <p className="text-slate-500 mt-2">This is your personal crypto command center.</p>
                    </div>
                    <Button className="gap-2 bg-gradient-to-r from-purple-500 to-orange-400 hover:from-purple-600 hover:to-orange-500 text-white shadow-lg">
                        <AtomIcon size={16} />
                        Generate Insights with Via
                    </Button>
                </div>

                {/* Hero Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Balance"
                        value={`$${portfolio.total_balance_usd.toLocaleString()}`}
                        subValue="Current Value"
                        icon={Wallet}
                        iconColor="text-indigo-500"
                        gradient="bg-gradient-to-br from-indigo-50 to-white"
                    />
                    <StatCard
                        title="Money In"
                        value={`$${earnings.total_received_usd.toLocaleString()}`}
                        subValue="Lifetime Received"
                        icon={ArrowDownLeft}
                        iconColor="text-emerald-500"
                        gradient="bg-gradient-to-br from-emerald-50 to-white"
                    />
                    <StatCard
                        title="Money Out"
                        value={`$${earnings.total_sent_usd.toLocaleString()}`}
                        subValue="Lifetime Sent"
                        icon={ArrowUpRight}
                        iconColor="text-rose-500"
                        gradient="bg-gradient-to-br from-rose-50 to-white"
                    />
                    <StatCard
                        title="Net Flow"
                        value={`${earnings.net_flow > 0 ? '+' : ''}$${earnings.net_flow.toLocaleString()}`}
                        subValue={earnings.net_flow > 0 ? "Profit" : "Loss"}
                        icon={Activity}
                        iconColor="text-orange-500"
                        gradient="bg-gradient-to-br from-orange-50 to-white"
                    />
                </div>

                {/* Main Charts Area */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Activity Chart */}
                    <Card className="col-span-12 md:col-span-8 border-none shadow-sm bg-white">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-slate-700 font-medium">Activity Over Time</CardTitle>
                                <p className="text-xs text-slate-500">Total transactions: {activity?.total_transactions ?? 0}</p>
                            </div>
                            <div className="flex gap-2">
                                {(["7D", "1M", "3M", "ALL"] as TimeRange[]).map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => setTimeRange(range)}
                                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${timeRange === range
                                            ? "bg-purple-500 text-white shadow-md"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                            }`}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                        </CardHeader>
                        <CardContent className="pl-0 pr-4">
                            <div style={{ width: '100%', height: 300, minHeight: 300 }}>
                                {chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart
                                            data={chartData}
                                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                            onMouseMove={(state: any) => {
                                                if (state && state.activePayload && state.activePayload.length) {
                                                    const payload = state.activePayload[0].payload;
                                                    setChartActiveName(payload.name);
                                                    setChartActiveValue(payload.value);
                                                }
                                            }}
                                            onMouseLeave={() => { setChartActiveName(null); setChartActiveValue(null); }}
                                        >
                                            <defs>
                                                <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                            <Tooltip content={<CustomTooltip />} />
                                            {chartActiveName && (
                                                <ReferenceLine x={chartActiveName} stroke="#e9d5ff" strokeWidth={2} strokeDasharray="4 4" />
                                            )}
                                            <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorActivity)" dot={{ r: 4, fill: '#8b5cf6' }} activeDot={{ r: 6 }} animationDuration={800} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                                        No activity data available for selected time range
                                    </div>
                                )}
                                {chartActiveName && (
                                    <div className="mt-2 text-sm text-slate-600">Selected: <strong className="text-slate-800">{chartActiveName}</strong> — <span className="font-medium">{chartActiveValue}</span></div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Asset Distribution */}
                    <Card className="col-span-12 md:col-span-4 border-none shadow-sm bg-white">
                        <CardHeader>
                            <CardTitle className="text-slate-700 font-medium">Active Assets</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[250px] w-full relative">
                                {tokenData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={tokenData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {tokenData.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                                        No active assets
                                    </div>
                                )}
                                {tokenData.length > 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <span className="text-2xl font-bold text-slate-800">{tokenData.length}</span>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 space-y-2">
                                {tokenData.slice(0, 3).map((token: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                            <span className="text-slate-600 truncate max-w-[100px]">{token.name}</span>
                                        </div>
                                        <span className="font-medium text-slate-900">{typeof token.value === 'number' ? token.value.toFixed(2) : token.value}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Spending Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-slate-800">Top Income Sources</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {(enrichment && enrichment.normalized && enrichment.normalized.top_counterparties) ? (
                                    (enrichment.normalized.top_counterparties.slice(0, 3)).map((item: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <a className="text-sm font-medium text-slate-700 hover:underline" href={`https://orb.helius.dev/address/${item.address}`} target="_blank" rel="noopener noreferrer">{item.label || (item.address.length > 12 ? `${item.address.slice(0, 6)}...${item.address.slice(-6)}` : item.address)}</a>
                                                <button onClick={() => { setLabelModalData({ label: item.label, address: item.address }); setLabelModalOpen(true); }} className="text-xs text-slate-400 hover:text-slate-600">What is this?</button>
                                            </div>
                                            <span className="text-sm font-bold text-emerald-600">+${(item.usd_volume || 0).toLocaleString()}</span>
                                        </div>
                                    ))
                                ) : (
                                    (data.income_streams?.top_income_sources || []).slice(0, 3).map((source: any, i: number) => {
                                        const addr = source.source;
                                        const label = addr.length > 12 ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : addr;
                                        return (
                                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                <a
                                                    className="text-sm font-medium text-slate-700 hover:underline hover:text-purple-600 transition-colors"
                                                    href={`https://orb.helius.dev/address/${addr}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {label}
                                                </a>
                                                <span className="text-sm font-bold text-emerald-600">+${source.value_usd.toLocaleString()}</span>
                                            </div>
                                        );
                                    })
                                )}
                                {(data.income_streams?.top_income_sources?.length || 0) === 0 && !(enrichment && enrichment.normalized && enrichment.normalized.top_counterparties) && (
                                    <p className="text-sm text-slate-400 italic">No income sources identified yet.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-slate-800">Top Spending</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {(enrichment && enrichment.normalized && enrichment.normalized.top_spending_categories && enrichment.normalized.top_spending_categories.length > 0) ? (
                                    enrichment.normalized.top_spending_categories.slice(0, 3).map((cat: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                            <span className="text-sm font-medium text-slate-700">{cat.category}</span>
                                            <span className="text-sm font-bold text-rose-600">-${cat.value_usd.toFixed(2)}</span>
                                        </div>
                                    ))
                                ) : (data.spending_categories?.top_spending_categories?.length > 0) ? (
                                    (data.spending_categories.top_spending_categories).map((cat: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                            <span className="text-sm font-medium text-slate-700">{cat.category}</span>
                                            <span className="text-sm font-bold text-rose-600">-${cat.value_usd.toFixed(2)}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-400 italic">No spending categories identified yet.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Right Sidebar - Solana News */}
            <div className="col-span-12 lg:col-span-3 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="bg-purple-100 p-2 rounded-lg">
                        <Activity className="text-purple-600" size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Solana News</h2>
                </div>
                <SolanaNews />
            </div>

            {/* Via Mascot */}
            <Via />
            <LabelInfo open={labelModalOpen} onClose={() => setLabelModalOpen(false)} label={labelModalData.label} address={labelModalData.address} />
        </div>
    );
}

export default Dashboard;

// Custom tooltip component for the activity chart
function CustomTooltip(props: any) {
    const { active, payload, label } = props;
    if (!active || !payload || !payload.length) return null;

    const p = payload[0].payload;
    return (
        <div className="bg-white p-3 rounded shadow-md text-sm">
            <div className="text-slate-600">{label}</div>
            <div className="mt-1 font-medium text-slate-800">{p.value} transactions</div>
        </div>
    );
}


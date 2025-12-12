import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { Download, Sparkles, ArrowUpRight, ArrowDownLeft, Activity, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { Via } from "@/components/Via";
import { SolanaNews } from "@/components/SolanaNews";

type TimeRange = "7D" | "1M" | "3M" | "ALL";

export function Dashboard() {
    const { wallet } = useParams<{ wallet: string }>();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<TimeRange>("1M");

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!wallet) return;

            try {
                const response = await fetch(`http://localhost:8000/api/analytics/${wallet}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch analytics");
                }
                const result = await response.json();
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

    // Filter chart data by time range
    const filterDataByRange = (monthlyData: Record<string, number>) => {
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

    const chartData = filterDataByRange(activity.monthly_frequency);

    const tokenData = portfolio.top_tokens.filter((t: any) => t.amount > 0).map((t: any) => ({
        name: t.symbol,
        value: t.amount,
    }));

    const COLORS = ['#8b5cf6', '#ec4899', '#f97316', '#06b6d4', '#10b981'];

    return (
        <div className="grid grid-cols-12 gap-6 p-6">
            <div className="col-span-12 lg:col-span-9 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                            Welcome Cypherpunkie
                        </h1>
                        <p className="text-slate-500 mt-2">Your personal crypto command center.</p>
                    </div>
                    <Button className="gap-2 bg-gradient-to-r from-purple-500 to-orange-400 hover:from-purple-600 hover:to-orange-500 text-white shadow-lg">
                        <Sparkles size={16} />
                        Ask Via for Insights
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
                            <CardTitle className="text-slate-700 font-medium">Activity Over Time</CardTitle>
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
                        <CardContent className="pl-0">
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            itemStyle={{ color: '#64748b' }}
                                        />
                                        <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorActivity)" />
                                    </AreaChart>
                                </ResponsiveContainer>
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
                                {data.income_streams.top_income_sources.slice(0, 3).map((source: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <span className="text-sm font-medium text-slate-700">{source.source}</span>
                                        <span className="text-sm font-bold text-emerald-600">+${source.value_usd.toLocaleString()}</span>
                                    </div>
                                ))}
                                {data.income_streams.top_income_sources.length === 0 && (
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
                                {data.spending_categories.top_spending_categories.map((cat: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <span className="text-sm font-medium text-slate-700">{cat.category}</span>
                                        <span className="text-sm font-bold text-rose-600">-${cat.value_usd.toFixed(2)}</span>
                                    </div>
                                ))}
                                {data.spending_categories.top_spending_categories.length === 0 && (
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
        </div>
    );
}

export default Dashboard;

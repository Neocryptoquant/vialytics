import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Clock } from "lucide-react";

interface NewsItem {
    title: string;
    body: string;
    url: string;
    source: string;
    published_on: number;
}

export function SolanaNews() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/news");
                const data = await response.json();
                setNews(data.news || []);
            } catch (error) {
                console.error("Failed to fetch news:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
        const interval = setInterval(fetchNews, 300000); // Refresh every 5 minutes
        return () => clearInterval(interval);
    }, []);

    const timeAgo = (timestamp: number) => {
        const now = Date.now() / 1000;
        const diff = now - timestamp;
        const hours = Math.floor(diff / 3600);
        if (hours < 1) return "Just now";
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map(i => (
                    <Card key={i} className="border-none shadow-sm">
                        <CardContent className="p-4">
                            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-slate-200 rounded w-full"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {news.map((item, i) => (
                <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow bg-white">
                    <CardContent className="p-4">
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="group">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <h4 className="text-sm font-semibold text-slate-800 group-hover:text-purple-600 transition-colors line-clamp-2">
                                    {item.title}
                                </h4>
                                <ExternalLink className="w-4 h-4 text-slate-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                                {item.body}
                            </p>
                            <div className="flex items-center justify-between text-xs text-slate-500">
                                <span className="font-medium">{item.source}</span>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{timeAgo(item.published_on)}</span>
                                </div>
                            </div>
                        </a>
                    </CardContent>
                </Card>
            ))}
            {news.length === 0 && !loading && (
                <Card className="border-none shadow-sm">
                    <CardContent className="p-6 text-center text-slate-500 text-sm">
                        No news available at the moment.
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

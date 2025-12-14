import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    subValue?: string;
    icon?: LucideIcon;
    iconColor?: string;
    gradient?: string;
    className?: string;
    trend?: "up" | "down" | "neutral";
}

export function StatCard({
    title,
    value,
    subValue,
    icon: Icon,
    iconColor = "text-slate-600",
    gradient = "bg-white",
    className,
    trend
}: StatCardProps) {
    return (
        <Card className={cn(
            "border-none shadow-sm hover:shadow-lg transition-all duration-300 cursor-default",
            "hover:scale-[1.02] hover:-translate-y-0.5",
            gradient,
            className
        )}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600/90 uppercase tracking-wide">
                    {title}
                </CardTitle>
                {Icon && (
                    <div className={cn(
                        "p-2 rounded-lg bg-white/50 shadow-sm",
                        iconColor.replace("text-", "bg-").replace("500", "100")
                    )}>
                        <Icon className={cn("h-4 w-4", iconColor)} />
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-900 tracking-tight">
                    {value}
                </div>
                {subValue && (
                    <p className={cn(
                        "text-xs mt-1 font-medium",
                        trend === "up" ? "text-emerald-600" :
                            trend === "down" ? "text-rose-600" :
                                "text-slate-500"
                    )}>
                        {trend === "up" && "↑ "}
                        {trend === "down" && "↓ "}
                        {subValue}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}


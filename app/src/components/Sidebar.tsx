import { LayoutDashboard, Wallet, ArrowRightLeft, Settings, LogOut, Search } from "lucide-react";

export function Sidebar() {
    return (
        <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen fixed left-0 top-0">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold">V</span>
                    </div>
                    <span className="font-bold text-xl tracking-tight">Vialytics</span>
                </div>

                <div className="space-y-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-sidebar-accent text-sidebar-accent-foreground transition-colors">
                        <LayoutDashboard size={20} />
                        <span className="text-sm font-medium">Dashboard</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors">
                        <Wallet size={20} />
                        <span className="text-sm font-medium">Portfolio</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors">
                        <ArrowRightLeft size={20} />
                        <span className="text-sm font-medium">Transactions</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors">
                        <Settings size={20} />
                        <span className="text-sm font-medium">Settings</span>
                    </button>
                </div>
            </div>

            <div className="mt-auto p-6 border-t border-sidebar-border">
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:text-destructive transition-colors">
                    <LogOut size={20} />
                    <span className="text-sm font-medium">Disconnect</span>
                </button>
            </div>
        </div>
    );
}

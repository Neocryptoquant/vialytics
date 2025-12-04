import Link from "next/link";
import { Settings } from "lucide-react";

export function Header() {
    return (
        <header className="sticky top-0 z-10 border-b border-gray-200 bg-background/80 backdrop-blur-sm dark:border-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {/* Placeholder for Logo - using text for now or an SVG if available */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-purple to-primary-orange text-white font-bold">
                                V
                            </div>
                            <span className="text-xl font-bold tracking-tight">Vialytics</span>
                        </Link>
                    </div>

                    <nav className="flex items-center space-x-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                        <Link href="#" className="hover:text-primary-purple transition-colors">
                            Markets
                        </Link>
                        <Link href="#" className="hover:text-primary-purple transition-colors">
                            Network
                        </Link>
                        <Link href="#" className="hover:text-primary-purple transition-colors">
                            Stake
                        </Link>
                        <button className="hover:text-primary-purple transition-colors">
                            <Settings className="h-5 w-5" />
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    );
}

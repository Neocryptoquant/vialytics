import { ConnectionArcDiagram } from "@/components/visualizations/ConnectionArcDiagram";
import { TokenFlowSankey } from "@/components/visualizations/TokenFlowSankey";
import { ActivityHeatmap } from "@/components/visualizations/ActivityHeatmap";
import { HistoryList } from "@/components/visualizations/HistoryList";

export default function DashboardPage() {
    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Visualization Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Connection Arc Diagram</h2>
                    <ConnectionArcDiagram />
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Wallet Activity Heatmap</h2>
                    <ActivityHeatmap />
                </section>
            </div>

            <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Token Flow Sankey</h2>
                <TokenFlowSankey />
            </section>

            <section className="max-w-2xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">History List</h2>
                <HistoryList />
            </section>
        </div>
    );
}

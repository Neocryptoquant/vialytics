import { Dashboard } from "@/pages/Dashboard";
import { Header } from "@/components/Header";
import { ModeProvider } from "@/components/ModeToggle";
import "./index.css";

export function App() {
  return (
    <ModeProvider>
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-slate-900 font-sans selection:bg-indigo-100">
        <Header />
        <main className="container mx-auto px-6 py-8 max-w-[1600px] relative z-10">
          <Dashboard />
        </main>

        {/* Background Blobs for extra "pop" */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200/30 blur-[120px] mix-blend-multiply animate-pulse" />
          <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-orange-200/30 blur-[100px] mix-blend-multiply animate-pulse delay-700" />
          <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[40%] rounded-full bg-indigo-200/30 blur-[120px] mix-blend-multiply animate-pulse delay-1000" />
        </div>
      </div>
    </ModeProvider>
  );
}

export default App;

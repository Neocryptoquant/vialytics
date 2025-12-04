import { PromptInput } from "@/components/PromptInput";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 text-center">
      <div className="mb-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-display bg-clip-text text-transparent bg-gradient-to-r from-primary-purple to-primary-orange">
          Vialytics
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          Visual analytics for your wallet history. Ask anything.
        </p>
      </div>

      <PromptInput />

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {["Visualize my gas spend", "Show my biggest inflows", "Who do I trade with most?"].map((prompt) => (
          <button
            key={prompt}
            className="rounded-full border border-gray-200 bg-white px-6 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

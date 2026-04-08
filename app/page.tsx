"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function Home() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [totalIdeas, setTotalIdeas] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    fetch("/api/stats")
      .then(res => res.json())
      .then(data => setTotalIdeas(data.totalIdeas))
      .catch(() => setTotalIdeas(0));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to analyze idea");
      }

      const data = await response.json();
      router.push(`/ideas/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-opacity duration-200 ease-in ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <Navbar />
      <main className="pt-[80px] pb-16 flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-[560px] mx-auto px-6">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center bg-[#eef2ff] px-3 py-1 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse mr-2"></span>
              <span className="text-[12px] font-medium text-indigo-600">AI-Powered Analysis</span>
            </div>
            
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight leading-[1.2]">
              Validate Your Startup Idea
            </h1>
            
            <p className="mt-4 text-base text-gray-500 max-w-md mx-auto leading-relaxed">
              Get an AI-generated validation report in seconds. Problem analysis, market sizing, competitor mapping, and profitability scoring — all in one place.
            </p>
          </div>

          <div className="mt-8 bg-white border border-[#e5e7eb] rounded-xl p-8 shadow-[0_1px_3px_rgba(0,0,0,0.06),_0_1px_2px_rgba(0,0,0,0.04)]">
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label
                  htmlFor="title"
                  className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2"
                >
                  Idea Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AI-powered resume builder"
                  required
                  className="w-full h-[44px] rounded-lg border border-[#e5e7eb] px-4 text-sm text-slate-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your startup idea in 2-3 sentences"
                  required
                  className="w-full min-h-[120px] resize-none rounded-lg border border-[#e5e7eb] p-4 text-sm text-slate-900 leading-relaxed placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                />
                <div className="mt-2 text-right text-xs text-gray-400">
                  {description.length} characters
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 flex w-full items-center justify-center h-[48px] rounded-lg bg-[#4f46e5] text-white font-medium text-sm tracking-[0.01em] transition hover:bg-[#4338ca] disabled:opacity-80 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing your idea...
                  </>
                ) : (
                  "Analyze Idea"
                )}
              </button>
            </form>
          </div>

          <div className="mt-8 flex items-center justify-center gap-8">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-slate-900">
                {totalIdeas !== null ? totalIdeas : "..."}
              </span>
              <span className="text-xs text-gray-400 uppercase tracking-wide mt-1">Ideas Validated</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-slate-900">98%</span>
              <span className="text-xs text-gray-400 uppercase tracking-wide mt-1">JSON Accuracy</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-slate-900">&lt; 3s</span>
              <span className="text-xs text-gray-400 uppercase tracking-wide mt-1">Avg Response Time</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

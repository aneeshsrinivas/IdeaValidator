"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import IdeaCard from "@/components/IdeaCard";

interface Idea {
  id: string;
  title: string;
  description: string;
  riskLevel: "Low" | "Medium" | "High";
  profitabilityScore: number;
}

function SkeletonCard() {
  return (
    <div className="w-full bg-white border border-[#e5e7eb] rounded-[10px] p-5 animate-pulse">
      <div className="flex justify-end">
        <div className="h-4 w-16 bg-gray-100 rounded-full"></div>
      </div>
      <div className="h-5 w-3/4 bg-gray-100 rounded mt-2"></div>
      <div className="h-3 w-full bg-gray-100 rounded mt-2"></div>
      <div className="h-3 w-5/6 bg-gray-100 rounded mt-1"></div>
      <div className="mt-4 mb-3 border-t border-gray-50"></div>
      <div className="flex justify-between items-center">
        <div className="h-4 w-16 bg-gray-100 rounded"></div>
        <div className="h-4 w-20 bg-gray-100 rounded"></div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const fetchIdeas = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ideas");
      if (!response.ok) {
        throw new Error("Failed to fetch ideas");
      }
      const data = await response.json();
      setIdeas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this idea?")) return;
    try {
      const res = await fetch(`/api/ideas/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setIdeas(prev => prev.filter(idea => idea.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchIdeas();
  }, []);

  return (
    <div className={`min-h-screen transition-opacity duration-200 ease-in ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <Navbar />
      <main className="max-w-5xl mx-auto pt-[96px] pb-16 px-6">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Your Ideas</h1>
            <p className="text-sm text-gray-400 mt-1">All previously validated startup ideas.</p>
          </div>
          <Link
            href="/"
            className="border border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-sm font-medium px-4 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            New Idea
          </Link>
        </div>

        <div className="h-[1px] w-full bg-[#f3f4f6] mt-6 mb-6"></div>

        {error && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-white p-8">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 w-full text-center">
              <p className="text-sm text-red-600">{error}</p>
            </div>
            <button
              onClick={fetchIdeas}
              className="mt-4 rounded-lg bg-[#4f46e5] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4338ca] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              Retry
            </button>
          </div>
        )}

        {isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {!isLoading && !error && ideas.length === 0 && (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-16 flex flex-col items-center text-center">
            <p className="text-sm font-medium text-gray-400">No ideas yet</p>
            <p className="text-xs text-gray-400 mt-1">Submit your first startup idea to get an AI-powered validation report.</p>
            <Link
              href="/"
              className="mt-6 flex items-center justify-center rounded-lg bg-[#4f46e5] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4338ca] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              Validate an Idea
            </Link>
          </div>
        )}

        {!isLoading && !error && ideas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ideas.map((idea) => (
              <IdeaCard
                key={idea.id}
                id={idea.id}
                title={idea.title}
                description={idea.description}
                riskLevel={idea.riskLevel}
                profitabilityScore={idea.profitabilityScore}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

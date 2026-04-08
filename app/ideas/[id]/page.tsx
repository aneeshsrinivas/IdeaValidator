"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";

interface Competitor {
  name: string;
  differentiation: string;
}

interface IdeaReport {
  id: string;
  title: string;
  description: string;
  riskLevel: "Low" | "Medium" | "High";
  profitabilityScore: number;
  problemSummary: string;
  customerPersona: string;
  marketOverview: string;
  competitors: Competitor[];
  techStack: string[];
  justification: string;
}

function SkeletonDetail() {
  return (
    <div className="animate-pulse">
      <div className="h-4 w-32 bg-gray-100 rounded mb-8"></div>
      <div className="h-10 w-3/4 bg-gray-100 rounded mb-4"></div>
      <div className="h-4 w-full bg-gray-100 rounded mb-2"></div>
      <div className="h-4 w-2/3 bg-gray-100 rounded mb-8"></div>

      <div className="flex gap-4 mb-8">
        <div className="flex-1 h-32 bg-gray-100 rounded-xl"></div>
        <div className="flex-1 h-32 bg-gray-100 rounded-xl"></div>
      </div>

      <div className="h-4 w-32 bg-gray-100 rounded mb-6"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 h-32 bg-gray-100 rounded-xl"></div>
        <div className="h-32 bg-gray-100 rounded-xl"></div>
        <div className="h-32 bg-gray-100 rounded-xl"></div>
        <div className="md:col-span-2 h-40 bg-gray-100 rounded-xl"></div>
        <div className="h-32 bg-gray-100 rounded-xl"></div>
        <div className="h-32 bg-gray-100 rounded-xl"></div>
      </div>
    </div>
  );
}

export default function IdeaDetail() {
  const params = useParams();
  const id = params.id as string;

  const [report, setReport] = useState<IdeaReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const fetchReport = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/ideas/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch report");
      }
      const data = await response.json();
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    if (id) {
      fetchReport();
    }
  }, [id]);

  const riskStyles: Record<string, string> = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-orange-100 text-orange-700",
    Hard: "bg-red-100 text-red-700",
    Low: "bg-green-100 text-green-700",
    High: "bg-red-100 text-red-700",
  };

  const normalizedRisk = report?.riskLevel ? (String(report.riskLevel).charAt(0).toUpperCase() + String(report.riskLevel).slice(1).toLowerCase().trim()) : "Medium";
  const appliedStyle = riskStyles[normalizedRisk] || riskStyles.Medium;

  return (
    <div className={`min-h-screen transition-opacity duration-200 ease-in ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <Navbar />
      <main className="max-w-3xl mx-auto pt-[96px] pb-16 px-6">
        {isLoading && <SkeletonDetail />}

        {error && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-white p-12">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
            <button
              onClick={fetchReport}
              className="mt-4 rounded-lg bg-[#4f46e5] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4338ca] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && report && (
          <>
            <div className="mb-8">
              <Link
                href="/dashboard"
                className="text-sm text-gray-400 hover:text-slate-900 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-sm"
              >
                ← Back to Dashboard
              </Link>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {report.title}
            </h1>
            <p className="text-base text-gray-500 mt-3 leading-relaxed max-w-2xl whitespace-pre-wrap">
              {report.description}
            </p>

            <div className="mt-7 flex gap-4">
              <div className="flex-1 bg-white border border-[#e5e7eb] rounded-xl p-5">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  RISK LEVEL
                </h3>
                <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${appliedStyle}`}>
                  {normalizedRisk}
                </span>
              </div>
              <div className="flex-1 bg-white border border-[#e5e7eb] rounded-xl p-5">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  PROFITABILITY SCORE
                </h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-5xl font-bold text-[#4f46e5]">{report.profitabilityScore}</span>
                  <span className="text-xl text-gray-300 font-normal ml-1">/100</span>
                </div>
                <div className="w-full h-1 bg-[#f3f4f6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#4f46e5] rounded-full transition-all duration-600 ease-out"
                    style={{ width: `${report.profitabilityScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Analysis Report
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Card 1 */}
                <div className="md:col-span-2 bg-white border border-[#e5e7eb] rounded-xl p-5 transition-colors hover:border-indigo-200">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Problem Summary</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{report.problemSummary}</p>
                </div>

                {/* Card 2 */}
                <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 transition-colors hover:border-indigo-200">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Customer Persona</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{report.customerPersona}</p>
                </div>

                {/* Card 3 */}
                <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 transition-colors hover:border-indigo-200">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Market Overview</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{report.marketOverview}</p>
                </div>

                {/* Card 4 */}
                <div className="md:col-span-2 bg-white border border-[#e5e7eb] rounded-xl p-5 transition-colors hover:border-indigo-200">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Competitor Analysis</h3>
                  <ul>
                    {report.competitors.map((comp, idx) => (
                      <li key={idx} className={`pb-3 mb-3 ${idx !== report.competitors.length - 1 ? 'border-b border-gray-50' : ''}`}>
                        <span className="text-sm font-semibold text-slate-900">{comp.name}</span>
                        <span className="text-sm text-gray-500"> — {comp.differentiation}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card 5 */}
                <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 transition-colors hover:border-indigo-200">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Suggested Tech Stack</h3>
                  <div className="flex flex-wrap">
                    {report.techStack.map((tech, idx) => (
                      <span key={idx} className="bg-slate-50 text-slate-700 text-xs font-medium px-3 py-1 rounded-full border border-slate-200 mr-2 mb-2">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card 6 */}
                <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 transition-colors hover:border-indigo-200">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Justification</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{report.justification}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

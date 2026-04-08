"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[56px] bg-white/90 backdrop-blur-sm border-b border-[#e5e7eb] px-8 flex items-center justify-between">
      <Link href="/" className="flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-sm">
        <span className="w-2 h-2 bg-[#4f46e5] mr-2"></span>
        <span className="font-semibold text-slate-900">IdeaValidator</span>
      </Link>
      
      {pathname === "/" ? (
        <Link
          href="/dashboard"
          className="relative text-sm font-medium text-gray-500 transition hover:text-slate-900 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-sm"
        >
          Dashboard
          <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#4f46e5] scale-x-0 transition-transform origin-left group-hover:scale-x-100"></span>
        </Link>
      ) : (
        <Link
          href="/"
          className="relative text-sm font-medium text-gray-500 transition hover:text-slate-900 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-sm"
        >
          Submit Idea
          <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#4f46e5] scale-x-0 transition-transform origin-left group-hover:scale-x-100"></span>
        </Link>
      )}
    </nav>
  );
}

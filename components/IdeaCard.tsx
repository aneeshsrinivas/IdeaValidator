import Link from "next/link";

interface IdeaCardProps {
  id: string;
  title: string;
  description: string;
  riskLevel: "Low" | "Medium" | "High";
  profitabilityScore: number;
  onDelete?: (id: string) => void;
}

export default function IdeaCard({
  id,
  title,
  description,
  riskLevel,
  profitabilityScore,
  onDelete,
}: IdeaCardProps) {
  const riskStyles: Record<string, string> = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-orange-100 text-orange-700",
    Hard: "bg-red-100 text-red-700",
    Low: "bg-green-100 text-green-700",
    High: "bg-red-100 text-red-700",
  };

  const normalizedRisk = riskLevel ? (String(riskLevel).charAt(0).toUpperCase() + String(riskLevel).slice(1).toLowerCase().trim()) : "Medium";
  const appliedStyle = riskStyles[normalizedRisk] || riskStyles.Medium;

  // We make the whole card clickable but semantically keep the link inside
  return (
    <Link
      href={`/ideas/${id}`}
      className="block w-full bg-white border border-[#e5e7eb] rounded-[10px] p-5 cursor-pointer transition-all duration-150 ease-in hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
    >
      <div className="flex justify-between items-start">
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${appliedStyle}`}
        >
          {normalizedRisk}
        </span>
        {onDelete && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(id);
            }}
            className="text-gray-300 hover:text-red-500 transition-colors p-1"
            title="Delete Idea"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        )}
      </div>
      
      <h3 className="mt-2 text-sm font-semibold text-slate-900 line-clamp-1">
        {title}
      </h3>
      
      <p className="mt-1 text-xs text-gray-400 line-clamp-2 leading-relaxed">
        {description}
      </p>
      
      <div className="mt-4 mb-3 border-t border-gray-50"></div>
      
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-400">
          Score <span className="text-sm font-bold text-[#4f46e5] ml-1">{profitabilityScore}</span>
        </div>
        
        <span className="text-xs font-medium text-gray-400 transition-colors group-hover:text-[#4f46e5]">
          View Report →
        </span>
      </div>
    </Link>
  );
}

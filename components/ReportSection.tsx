interface ReportSectionProps {
  label: string;
  children: React.ReactNode;
}

export default function ReportSection({ label, children }: ReportSectionProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280]">
        {label}
      </p>
      <div className="mt-3 text-[#111827]">{children}</div>
    </div>
  );
}

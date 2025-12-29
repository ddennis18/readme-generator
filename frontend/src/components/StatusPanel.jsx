import { AlertTriangle, CheckCircle2 } from "lucide-react";

export default function StatusPanel({ status }) {
  const { confidence, warnings } = status;

  return (
    <div className="flex gap-4 items-center p-4 bg-neutral-800/30 border border-neutral-700/50 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-sm text-neutral-500 uppercase tracking-wider font-semibold">
          Confidence:
        </span>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-900/30 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          <CheckCircle2 className="h-3 w-3" />
          {confidence.toUpperCase()}
        </div>
      </div>

      {warnings && warnings.length > 0 && (
        <div className="flex items-center gap-2 ml-4">
          <span className="text-sm text-neutral-500 uppercase tracking-wider font-semibold">
            Warnings:
          </span>
          {warnings.map((w, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-900/30 border border-amber-500/30 text-amber-400 text-xs font-medium"
            >
              <AlertTriangle className="h-3 w-3" />
              {w}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { cn } from "@/lib/utils";
import { Twitter } from "lucide-react";

type Sentiment = "positive" | "neutral" | "negative" | null;
type Probs = Record<"positive" | "neutral" | "negative", number> | null;

type Props = {
  sentiment: Sentiment;
  probs: Probs;
};

/* ── colour palette (Tailwind core colours → works v2 / v3) ────────── */
const palette = {
  positive: {
    chipBg: "bg-green-50 dark:bg-emerald-900/20",
    chipTxt: "text-emerald-600 dark:text-emerald-400",
    bar: "bg-emerald-500",
    icon: "💚",
    label: "Positive",
  },
  neutral: {
    chipBg: "bg-yellow-50 dark:bg-yellow-900/20",
    chipTxt: "text-yellow-600 dark:text-yellow-400",
    bar: "bg-yellow-400",
    icon: "🟡",
    label: "Neutral",
  },
  negative: {
    chipBg: "bg-rose-50 dark:bg-rose-900/20",
    chipTxt: "text-rose-600 dark:text-rose-400",
    bar: "bg-rose-500",
    icon: "❤️",
    label: "Negative",
  },
} as const;
/* ─────────────────────────────────────────────────────────────────── */

const categories: Exclude<Sentiment, null>[] = [
  "negative",
  "neutral",
  "positive",
];

const ResultCard = ({ sentiment, probs }: Props) => {
  if (!sentiment) return null;

  const cfg = palette[sentiment];

  /* ensure we always have three bars */
  const safeProbs = probs ?? {
    positive: 0,
    neutral: 0,
    negative: 0,
  };

  return (
    
    <div className="w-full rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-fade-in">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900 dark:text-white">
            Sentiment Analysis Result
          </span>
          <span
            className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-medium",
              cfg.chipBg,
              cfg.chipTxt
            )}
          >
            {cfg.icon}
            <span>{cfg.label}</span>
          </span>
        </div>
        <span className="hidden sm:block text-4xl">{cfg.icon}</span>
      </div>

      {/* probability bars */}
      <div className="space-y-3">
        {categories.map((cat) => {
          const val = safeProbs[cat] ?? 0;
          return (
            <div key={cat} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="capitalize text-gray-600 dark:text-gray-400">
                  {palette[cat].label}
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {(val * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    palette[cat].bar
                  )}
                  style={{ width: `${val * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultCard;

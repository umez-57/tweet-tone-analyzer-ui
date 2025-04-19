import { cn } from "@/lib/utils";

type Sentiment = "positive" | "neutral" | "negative" | null;
type Probs = Record<string, number> | null;

type Props = {
  sentiment: Sentiment;
  probs: Probs;
};

/* colour + emoji palette */
const palette: Record<
  "positive" | "neutral" | "negative",
  { emoji: string; bar: string; txt: string }
> = {
  positive: { emoji: "💚", bar: "bg-positive", txt: "Positive" },
  neutral:  { emoji: "🟡", bar: "bg-neutral" , txt: "Neutral"  },
  negative: { emoji: "❤️", bar: "bg-negative", txt: "Negative" },
};

const ResultCard = ({ sentiment, probs }: Props) => {
  if (!sentiment) return null;

  const cfg = palette[sentiment];

  /* decide which bars to draw — skip any prob ≤ 0   */
  const barKeys = probs
    ? (Object.keys(probs) as Array<keyof typeof probs>).filter(
        (k) => probs[k]! > 1e-4
      )
    : [];

  return (
    <div className="mt-6 card border animate-fade-in p-4">
      {/* headline */}
      <div className="flex flex-col items-center">
        <div className="text-4xl mb-2">{cfg.emoji}</div>
        <div className="font-semibold">{cfg.txt}</div>
      </div>

      {/* probability bars */}
      {probs && barKeys.length > 0 && (
        <div className="mt-4 space-y-2">
          {barKeys.map((k) => (
            <div key={k}>
              <div className="flex justify-between text-xs mb-0.5">
                <span className="capitalize">{k}</span>
                <span>{(probs[k]! * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded">
                <div
                  className={cn("h-2 rounded", palette[k].bar)}
                  style={{ width: `${probs[k]! * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultCard;
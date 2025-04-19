import { cn } from "@/lib/utils";

type Sentiment = "positive" | "neutral" | "negative" | null;
type Probs = Record<string, number> | null;

type Props = {
  sentiment: Sentiment;
  probs: Probs;
};

const sentimentConfig = {
  positive: {
    bg: "bg-[#E8F7F0]",
    text: "text-[#00BA7C]",
    icon: "💚",
    label: "Positive"
  },
  neutral: {
    bg: "bg-[#FFF8E7]",
    text: "text-[#FFD700]",
    icon: "🟡",
    label: "Neutral"
  },
  negative: {
    bg: "bg-[#FFE9EC]",
    text: "text-[#F4212E]",
    icon: "❤️",
    label: "Negative"
  }
};

const ResultCard = ({ sentiment, probs }: Props) => {
  if (!sentiment) return null;

  const config = sentimentConfig[sentiment];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <span className="font-bold text-gray-900 dark:text-white">Sentiment Analysis Result</span>
        <span className={cn(
          "flex items-center gap-1 px-2 py-0.5 rounded-full",
          config.bg,
          config.text
        )}>
          {config.icon}
          <span className="capitalize">{config.label}</span>
        </span>
      </div>

      {probs && (
        <div className="space-y-3">
          {Object.entries(probs).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400 capitalize">{key}</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {(value * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    {
                      "bg-[#00BA7C]": key === "positive",
                      "bg-[#FFD700]": key === "neutral",
                      "bg-[#F4212E]": key === "negative"
                    }
                  )}
                  style={{ width: `${value * 100}%` }}
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
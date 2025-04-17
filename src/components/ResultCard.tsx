
import React from 'react';
import { cn } from '@/lib/utils';

type SentimentLabel = "positive" | "neutral" | "negative" | null;

type ResultCardProps = {
  sentiment: SentimentLabel;
};

const ResultCard = ({ sentiment }: ResultCardProps) => {
  if (!sentiment) return null;

  const sentimentConfig = {
    positive: {
      emoji: '💚',
      label: 'Positive',
      bgColor: 'bg-positive/10',
      textColor: 'text-positive',
      borderColor: 'border-positive/20',
    },
    neutral: {
      emoji: '🟡',
      label: 'Neutral',
      bgColor: 'bg-neutral/10',
      textColor: 'text-neutral',
      borderColor: 'border-neutral/20',
    },
    negative: {
      emoji: '❤️',
      label: 'Negative',
      bgColor: 'bg-negative/10',
      textColor: 'text-negative',
      borderColor: 'border-negative/20',
    },
  };

  const config = sentimentConfig[sentiment];

  return (
    <div className={cn("mt-6 card border animate-fade-in", config.borderColor)}>
      <div className="flex flex-col items-center justify-center p-4">
        <div className="animate-scale-in text-4xl mb-2">{config.emoji}</div>
        <div className={cn("px-4 py-1 rounded-full font-medium", config.bgColor, config.textColor)}>
          {config.label}
        </div>
      </div>
    </div>
  );
};

export default ResultCard;

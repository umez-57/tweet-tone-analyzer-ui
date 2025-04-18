/* src/components/FeedbackCard.tsx */
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  predictionId: string;
  onDone: () => void;                // remove the card after submit
};

export const FeedbackCard = ({ predictionId, onDone }: Props) => {
  const [stage, setStage] = useState<"ask" | "label">("ask");

  /* chosen values */
  const [correct, setCorrect] = useState<null | boolean>(null);
  const [chosenLabel, setChosenLabel] =
    useState<"positive" | "neutral" | "negative" | null>(null);

  /* submit to backend */
  const send = async () => {
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: predictionId,
        correct: correct,
        corrected_label: chosenLabel,
      }),
    });
    onDone();
  };

  return (
    <div className="mt-6 card border p-4 animate-fade-in">
      {stage === "ask" && (
        <>
          <p className="mb-4 text-sm font-medium">
            Was this prediction correct?
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setCorrect(true);
                send();
              }}
            >
              Yes
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setStage("label");
                setCorrect(false);
              }}
            >
              No
            </Button>
          </div>
        </>
      )}

      {stage === "label" && (
        <>
          <p className="mb-4 text-sm font-medium">
            Thanks! What should it be?
          </p>
          <div className="flex gap-2 flex-wrap">
            {(["positive", "neutral", "negative"] as const).map((l) => (
              <Button
                key={l}
                variant="outline"
                className={cn(
                  "capitalize flex-1 min-w-[90px]",
                  chosenLabel === l && "ring-2 ring-primary"
                )}
                onClick={() => setChosenLabel(l)}
              >
                {l}
              </Button>
            ))}
          </div>
          <Button
            className="mt-4 w-full"
            disabled={!chosenLabel}
            onClick={send}
          >
            Submit
          </Button>
        </>
      )}
    </div>
  );
};

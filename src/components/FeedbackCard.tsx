import { useState } from "react";
import { Button }   from "@/components/ui/button";
import { cn }       from "@/lib/utils";

/* ---------- types that travel back to the parent ------------------- */
export type FeedbackPayload = {
  id: string;
  correct: boolean;
  corrected_label?: "positive" | "neutral" | "negative";
};

type Props = {
  predictionId: string;
  onSubmit: (payload: FeedbackPayload) => void; // <-- notify parent
};

/* ------------------------------------------------------------------- */
const FeedbackCard = ({ predictionId, onSubmit }: Props) => {
  /* step 1 👉 ask “correct?” ; step 2 👉 ask for label (when “No”) */
  const [stage, setStage] = useState<"ask" | "label">("ask");

  const [chosenLabel, setChosenLabel] =
    useState<"positive" | "neutral" | "negative" | null>(null);

  /* helper that builds payload and fires callback -------------------- */
  const send = (correct: boolean) => {
    const payload: FeedbackPayload = { id: predictionId, correct };
    if (!correct) payload.corrected_label = chosenLabel!;
    onSubmit(payload);
  };

  /* ------------------------------------------------------------------ */
  return (
    <div className="mt-6 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-fade-in">
      {/* ───────── Stage 1: Yes / No ────────────────────────────── */}
      {stage === "ask" && (
        <>
          <p className="mb-4 text-sm font-medium">
            Was this prediction correct?
          </p>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => send(true)}
            >
              Yes
            </Button>

            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setStage("label")}
            >
              No
            </Button>
          </div>
        </>
      )}

      {/* ───────── Stage 2: choose correct label ────────────────── */}
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
            onClick={() => send(false)}
          >
            Submit
          </Button>
        </>
      )}
    </div>
  );
};

export default FeedbackCard;

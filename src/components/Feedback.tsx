/* ───────── src/components/FeedbackCard.tsx ────────────────────────────── */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn }    from "@/lib/utils";

type Props = {
  predictionId: string;
  /** called after feedback is successfully sent – lets the parent hide the card */
  onDone: () => void;
};

export const FeedbackCard = ({ predictionId, onDone }: Props) => {
  /** ui stage: first ask “correct?” then (if “No”) ask for the right label */
  const [stage, setStage] = useState<"ask" | "label">("ask");

  /* user’s choices ------------------------------------------------------- */
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [chosenLabel, setChosenLabel] =
    useState<"positive" | "neutral" | "negative" | null>(null);

  /* POST to /api/feedback ------------------------------------------------ */
  const send = async () => {
    /* build payload so we don’t send corrected_label when it’s not needed */
    const payload: Record<string, unknown> = {
      id: predictionId,
      correct,
    };
    if (correct === false) payload.corrected_label = chosenLabel;

    await fetch("/api/feedback", {
      method : "POST",
      headers: { "Content-Type": "application/json" },
      body   : JSON.stringify(payload),
    });

    onDone();                       // tell the caller to hide the card
  };

  /* ui ------------------------------------------------------------------- */
  return (
    <div className="mt-6 card border p-4 animate-fade-in">
      {/* ───────── First step: ask Yes / No ─────────────────────────────── */}
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
                send();             // no extra label needed
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

      {/* ───────── Second step: if “No”, ask for the right label ────────── */}
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

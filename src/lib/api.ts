// ────────────────────────────────────────────────────────────────
// src/lib/api.ts
// central place for every call the front‑end makes to FastAPI
// ────────────────────────────────────────────────────────────────
import { useMutation } from "@tanstack/react-query";

/*─────────────────────── shared types ──────────────────────────*/
export type Sentiment = "positive" | "neutral" | "negative";

/** returned by /predict  and inside each element of /batch_predict */
export interface Probabilities {
  negative: number;
  positive: number;
  /** present only for 3‑label models */
  neutral?: number;
}

export interface SingleResult {
  id: string;                 // uuid from Supabase
  label: Sentiment;           // predicted class
  probs: Probabilities;       // class probabilities
  /**  text is included only in batch responses */
  text?: string;
}

/*───────────── request bodies (what we POST) ───────────────────*/
export interface PredictBody {
  text: string;
  model: "roberta" | "bertweet" | "roberta2L" | "bertweet2L";
}

export interface BatchBody {
  texts: string[];
  model: PredictBody["model"];
}

export interface FeedbackBody {
  id: string;
  correct: boolean;         // “was the prediction correct?”
  /** if correct === false you may send the class the user picked  */
  corrected_label?: Sentiment;
}

/*───────────── responses (what we GET back) ────────────────────*/
export interface PredictResponse extends SingleResult {}

export interface BatchResponse {
  overall: Omit<SingleResult, "id">; // aggregate line (no uuid)
  results: SingleResult[];           // per‑tweet results
}

/*──────────────── hooks – ready to use in pages/components ─────*/
const json = async <T>(r: Response) => {
  if (!r.ok) throw new Error((await r.text()) || `API ${r.status}`);
  return r.json() as Promise<T>;
};

/** POST /predict  (single sentence) */
export const usePredict = () =>
  useMutation<PredictResponse, Error, PredictBody>((body) =>
    fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(json<PredictResponse>)
  );

/** POST /batch_predict  (≤ 10 sentences) */
export const useBatchPredict = () =>
  useMutation<BatchResponse, Error, BatchBody>((body) =>
    fetch("/api/batch_predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(json<BatchResponse>)
  );

/** POST /feedback  (send user feedback on a previous prediction) */
export const useSendFeedback = () =>
  useMutation<unknown, Error, FeedbackBody>((body) =>
    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(json<unknown>)
  );

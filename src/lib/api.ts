// src/lib/api.ts
import { useMutation } from "@tanstack/react-query";

/* ─── types that mirror backend/app.py ───────────────────────────── */

export type Sentiment = "positive" | "neutral" | "negative";

export type Model =
  | "roberta"
  | "bertweet"
  | "roberta2L"   // 2‑label RoBERTa checkpoint
  | "bertweet2L"; // 2‑label BERTweet checkpoint

const BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? ""; 

/* single‑text request ------------------------------------------- */
export interface PredictBody {
  text: string;
  model: Model;
}

export interface PredictResponse {
  id: string;                            // uuid for feedback endpoint
  label: Sentiment;
  probs: Record<string, number>;         // e.g. {negative:0.12, …}
}

/* batch request  (≤ 10 lines) ----------------------------------- */
export interface BatchBody {
  texts: string[];
  model: Model;
}

export interface BatchResponse {
  overall: { label: Sentiment; probs: Record<string, number> };
  results: Array<{
    id: string;
    text: string;
    label: Sentiment;
    probs: Record<string, number>;
  }>;
}

/* ─── React‑Query hooks  ───────────────────────────────────────── */

export const usePredict = () =>
  useMutation<PredictResponse, Error, PredictBody>(async (body) => {
    const res = await fetch(`${BASE}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error((await res.text()) || `API ${res.status}`);
    return res.json();
  });

export const useBatchPredict = () =>
  useMutation<BatchResponse, Error, BatchBody>(async (body) => {
    const res = await fetch(`${BASE}/batch_predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error((await res.text()) || `API ${res.status}`);
    return res.json();
  });

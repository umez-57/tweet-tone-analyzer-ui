// src/lib/api.ts
import { useMutation } from "@tanstack/react-query";

export type Sentiment = "positive" | "neutral" | "negative";

export interface PredictBody {
  text: string;
  model: "roberta" | "bertweet";
}

export interface PredictResponse {
  label: Sentiment;
}

// Use this in Index.tsx
export const usePredict = () =>
  useMutation<PredictResponse, Error, PredictBody>(async (body) => {
    const res = await fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || `API ${res.status}`);
    }
    return res.json();
  });

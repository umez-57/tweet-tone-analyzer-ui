import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ModelSelect from "@/components/ModelSelect";
import type { Model } from "@/components/ModelSelect";
import TextInput from "@/components/TextInput";
import PredictButton from "@/components/PredictButton";
import ResultCard from "@/components/ResultCard";
import BatchList from "@/components/BatchList";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  import.meta.env.NEXT_PUBLIC_API_URL ||
  "/api";

const singleApi = (body: { text: string; model: Model }) =>
  fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(async (r) => {
    if (!r.ok) throw new Error((await r.text()) || `API ${r.status}`);
    return r.json() as Promise<{ id: string; label: string; probs: any }>;
  });

const batchApi = (body: { texts: string[]; model: Model }) =>
  fetch(`${API_BASE}/batch_predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(async (r) => {
    if (!r.ok) throw new Error((await r.text()) || `API ${r.status}`);
    return r.json() as Promise<{
      results: { id: string; text: string; label: string; probs: any }[];
      overall: { label: string; probs: any };
    }>;
  });

const feedbackApi = (body: {
  id: string;
  correct: boolean;
  corrected_label?: string;
}) =>
  fetch(`${API_BASE}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(async (r) => {
    if (!r.ok) throw new Error((await r.text()) || `API ${r.status}`);
    return r.json();
  });

type Sentiment = "positive" | "neutral" | "negative";
const NEUTRAL_MODELS = new Set<Model>(["roberta", "bertweet"]);

const Index = () => {
  const [model, setModel] = useState<Model>("roberta");
  const [mode, setMode] = useState<"single" | "batch">("single");
  const [text, setText] = useState("");
  const [overall, setOverall] = useState<{ label: string; probs: any } | null>(
    null
  );
  const [items, setItems] = useState<
    { id: string; text: string; label: string }[]
  >([]);
  const [predId, setPredId] = useState<string | null>(null);
  const [askFeedback, setAskFeedback] = useState(false);
  const [feedbackStep, setFeedbackStep] = useState<
    "question" | "correction" | "done"
  >("question");
  const [chosenLabel, setChosenLabel] = useState<Sentiment>("positive");

  const { mutate: predict, isLoading } = useMutation({
    mutationFn: async () => {
      if (mode === "batch") {
        const lines = text.split(/\r?\n/).filter((l) => l.trim());
        return batchApi({ texts: lines, model });
      }
      return singleApi({ text, model });
    },
    onSuccess: (data) => {
      if (mode === "batch") {
        setOverall(data.overall);
        setItems(data.results);
        setPredId(null);
      } else {
        setOverall(data);
        setItems([]);
        setPredId(data.id);
      }
    },
    onError: (e: any) => toast.error(e.message || "Prediction failed"),
  });

  const { mutate: sendFeedback, isLoading: fbLoading } = useMutation({
    mutationFn: feedbackApi,
    onSuccess: () => {
      toast.success("Thanks for your feedback!");
      setFeedbackStep("done");
    },
    onError: (e: any) => toast.error(e.message || "Couldn't save feedback"),
  });

  const run = () => {
    if (!text.trim()) return;

    if (mode === "batch") {
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (lines.length > 10) {
        toast.error("Maximum 10 lines");
        return;
      }
    }

    setOverall(null);
    setItems([]);
    setAskFeedback(false);
    setFeedbackStep("question");
    setPredId(null);

    predict();
  };

  useEffect(() => {
    if (predId && overall) {
      const t = setTimeout(() => setAskFeedback(true), 3000);
      return () => clearTimeout(t);
    }
  }, [predId, overall]);

  const labelOptions = useMemo<Sentiment[]>(
    () =>
      NEUTRAL_MODELS.has(model)
        ? ["positive", "neutral", "negative"]
        : ["positive", "negative"],
    [model]
  );

  const handleYes = () =>
    predId && sendFeedback({ id: predId, correct: true });
  const handleNo = () => setFeedbackStep("correction");
  const submitCorrection = () =>
    predId &&
    sendFeedback({
      id: predId,
      correct: false,
      corrected_label: chosenLabel,
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 dark:from-background dark:to-background/90">
      <main className="max-w-xl mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Header />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass rounded-xl p-6 mt-8 backdrop-blur-sm"
        >
          <div className="space-y-4 mb-4">
            <ModelSelect model={model} setModel={setModel} />

            <div className="min-w-[140px]">
              <label
                htmlFor="mode-select"
                className="block text-sm font-medium mb-1 text-foreground/80"
              >
                Mode
              </label>
              <Select
                value={mode}
                onValueChange={(v) => setMode(v as "single" | "batch")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single sentence</SelectItem>
                  <SelectItem value="batch">Batch (≤ 10 lines)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TextInput
            text={text}
            setText={setText}
            onClassify={run}
            maxLines={mode === "batch" ? 10 : 1}
          />
          <PredictButton
            isLoading={isLoading}
            disabled={!text.trim()}
            onClick={run}
          />
        </motion.div>

        {overall && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ResultCard
              sentiment={overall.label as any}
              probs={overall.probs}
            />
          </motion.div>
        )}

        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BatchList items={items as any} />
          </motion.div>
        )}

        {askFeedback && feedbackStep === "question" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 glass rounded-xl p-6 backdrop-blur-sm flex flex-col items-center gap-3"
          >
            <span className="font-medium text-foreground">
              Was the prediction correct?
            </span>
            <div className="flex gap-3">
              <button
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                disabled={fbLoading}
                onClick={handleYes}
              >
                Yes
              </button>
              <button
                className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
                disabled={fbLoading}
                onClick={handleNo}
              >
                No
              </button>
            </div>
          </motion.div>
        )}

        {askFeedback && feedbackStep === "correction" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 glass rounded-xl p-6 backdrop-blur-sm flex flex-col gap-3"
          >
            <span className="font-medium text-center text-foreground">
              What should it be?
            </span>
            <Select
              value={chosenLabel}
              onValueChange={(v) => setChosenLabel(v as Sentiment)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {labelOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt[0].toUpperCase() + opt.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors self-center"
              disabled={fbLoading}
              onClick={submitCorrection}
            >
              Submit
            </button>
          </motion.div>
        )}

        {feedbackStep === "done" && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center text-sm text-muted-foreground"
          >
            🎉 Thank you for helping us improve!
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Footer />
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

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

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL || "/api";

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

const TweetResult = ({ text, sentiment, probs }) => {
  const sentimentColors = {
    positive: "bg-green-500",
    negative: "bg-red-500",
    neutral: "bg-yellow-500"
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-gray-900 dark:text-gray-100">Analysis Result</span>
            <div className={`w-2 h-2 rounded-full ${sentimentColors[sentiment]}`} />
          </div>
          <p className="text-gray-800 dark:text-gray-200 mb-3">{text}</p>
          <div className="flex gap-3">
            {Object.entries(probs || {}).map(([key, value]) => (
              <div key={key} className="text-sm">
                <span className="text-gray-500 dark:text-gray-400 capitalize">{key}: </span>
                <span className="font-medium">{(Number(value) * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

type Sentiment = "positive" | "neutral" | "negative";
const NEUTRAL_MODELS = new Set<Model>(["roberta", "bertweet"]);

const Index = () => {
  const [model, setModel] = useState<Model>("roberta");
  const [mode, setMode] = useState<"single" | "batch">("single");
  const [text, setText] = useState("");
  const [overall, setOverall] = useState<{ label: string; probs: any } | null>(null);
  const [items, setItems] = useState<{ id: string; text: string; label: string }[]>([]);
  const [predId, setPredId] = useState<string | null>(null);
  const [askFeedback, setAskFeedback] = useState(false);
  const [feedbackStep, setFeedbackStep] = useState<"question" | "correction" | "done">("question");
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-2xl mx-auto p-4">
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
          className="bg-white dark:bg-gray-800 rounded-xl p-6 mt-8 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="space-y-4 mb-4">
            <ModelSelect model={model} setModel={setModel} />
            <div className="min-w-[140px]">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Mode
              </label>
              <Select value={mode} onValueChange={(v) => setMode(v as "single" | "batch")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single tweet</SelectItem>
                  <SelectItem value="batch">Batch (≤ 10 tweets)</SelectItem>
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
            className="mt-6"
          >
            <TweetResult 
              text={text}
              sentiment={overall.label}
              probs={overall.probs}
            />
          </motion.div>
        )}

        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 space-y-4"
          >
            {items.map((item, index) => (
              <TweetResult
                key={item.id}
                text={item.text}
                sentiment={item.label}
                probs={item.probs}
              />
            ))}
          </motion.div>
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
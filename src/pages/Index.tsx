import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Twitter } from "lucide-react";

import Header      from "@/components/Header";
import Footer      from "@/components/Footer";
import ModelSelect, { type Model } from "@/components/ModelSelect";
import TextInput   from "@/components/TextInput";
import PredictButton from "@/components/PredictButton";
import ResultCard  from "@/components/ResultCard";
import BatchList   from "@/components/BatchList";
import FeedbackCard, {
  type FeedbackPayload,
} from "@/components/FeedbackCard"; // ✅ correct import!

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ─────────────────────────────────────────────────────────────── */

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

const feedbackApi = (payload: FeedbackPayload) =>
  fetch(`${API_BASE}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(async (r) => {
    if (!r.ok) throw new Error((await r.text()) || `API ${r.status}`);
    return r.json();
  });

/* ---------------------------------------------------------------- */

type Sentiment = "positive" | "neutral" | "negative";
const NEUTRAL_MODELS = new Set<Model>(["roberta", "bertweet"]);

/* bubble avatar + ResultCard ------------------------------------ */
const AnalysisCard = ({
  sentiment,
  probs,
}: {
  sentiment: Sentiment;
  probs: any;
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex items-start gap-3">
    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0">
      <Twitter className="h-6 w-6" />
    </div>
    <ResultCard sentiment={sentiment} probs={probs} />
  </div>
);

/* ---------------------------------------------------------------- */

const Index = () => {
  const [model, setModel] = useState<Model>("roberta");
  const [mode,  setMode]  = useState<"single" | "batch">("single");
  const [text,  setText]  = useState("");

  /* results --------------------------------------------------- */
  const [overall, setOverall] =
    useState<{ label: string; probs: any } | null>(null);
  const [items, setItems] = useState<
    { id: string; text: string; label: string; probs: any }[]
  >([]);

  /* feedback popup state -------------------------------------- */
  const [predId,       setPredId]       = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  /* ---------------- prediction mutation ---------------------- */
  const { mutate: predict, isLoading } = useMutation({
    mutationFn: async () => {
      if (mode === "batch") {
        const lines = text.split(/\r?\n/).filter(Boolean);
        return batchApi({ texts: lines, model });
      }
      return singleApi({ text, model });
    },
    onSuccess: (data) => {
      if (mode === "batch") {
        setOverall(data.overall);
        setItems(data.results);
        setPredId(null);
        setShowFeedback(false);
      } else {
        setOverall(data);
        setItems([]);
        setPredId(data.id);
      }
    },
    onError: (e: any) => toast.error(e.message || "Prediction failed"),
  });

  /* ---------------- feedback mutation ------------------------ */
  const { mutate: sendFeedback } = useMutation({
    mutationFn: feedbackApi,
    onSuccess: () => {
      toast.success("Thanks for your feedback!");
      setShowFeedback(false);
    },
    onError: (e: any) => toast.error(e.message || "Couldn't save feedback"),
  });

  /* trigger popup 3 s after single‑mode prediction ------------- */
  useEffect(() => {
    if (predId && mode === "single") {
      const t = setTimeout(() => setShowFeedback(true), 3000);
      return () => clearTimeout(t);
    }
  }, [predId, mode]);

  /* helper to run the API call -------------------------------- */
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
    setShowFeedback(false);
    setPredId(null);

    predict();
  };

  /* ---------------------------------------------------------------- UI */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-2xl mx-auto p-4">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Header />
        </motion.div>

        {/* form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 mt-8 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="space-y-4 mb-4">
            <ModelSelect model={model} setModel={setModel} />

            {/* mode selector */}
            <div className="min-w-[140px]">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
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
                  <SelectItem value="single">Single tweet</SelectItem>
                  <SelectItem value="batch">Batch (≤ 10 tweets)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* textarea + predict button */}
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

        {/* overall result (single OR batch) */}
        {overall && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <AnalysisCard
              sentiment={overall.label as Sentiment}
              probs={overall.probs}
            />
          </motion.div>
        )}

        {/* batch list of individual lines */}
        {mode === "batch" && items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BatchList
              items={items.map(({ text, label }) => ({
                text,
                label: label as Sentiment,
              }))}
            />
          </motion.div>
        )}

        {/* feedback popup (single mode only) */}
        {showFeedback && predId && (
          <FeedbackCard
            predictionId={predId}
            onSubmit={(payload) => sendFeedback(payload)}
          />
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

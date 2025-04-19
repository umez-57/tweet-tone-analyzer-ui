/* ------------------------------------------------------------------
   Tweet‑Tone Frontend — main page
   ------------------------------------------------------------------ */

   import { useEffect, useMemo, useState } from "react";
   import { useMutation } from "@tanstack/react-query";
   import { toast }     from "sonner";
   
   import Header        from "@/components/Header";
   import Footer        from "@/components/Footer";
   import ModelSelect   from "@/components/ModelSelect";
   import type { Model } from "@/components/ModelSelect";
   import TextInput     from "@/components/TextInput";
   import PredictButton from "@/components/PredictButton";
   import ResultCard    from "@/components/ResultCard";
   import BatchList     from "@/components/BatchList";
   
   /* shadcn/ui */
   import {
     Select, SelectContent, SelectItem,
     SelectTrigger, SelectValue
   } from "@/components/ui/select";
   
   /* --------------- runtime config -------------------- */
   const API_BASE =
     import.meta.env.VITE_API_URL ||
     // keep NEXT_* for Next.js compatibility
     import.meta.env.NEXT_PUBLIC_API_URL ||
     "/api";
   
   /* ---------------- helper fns ----------------------- */
   const singleApi = (body: { text: string; model: Model }) =>
     fetch(`${API_BASE}/predict`, {
       method : "POST",
       headers: { "Content-Type": "application/json" },
       body   : JSON.stringify(body),
     }).then(async r => {
       if (!r.ok) throw new Error((await r.text()) || `API ${r.status}`);
       return r.json() as Promise<{ id: string; label: string; probs: any }>;
     });
   
   const batchApi = (body: { texts: string[]; model: Model }) =>
     fetch(`${API_BASE}/batch_predict`, {
       method : "POST",
       headers: { "Content-Type": "application/json" },
       body   : JSON.stringify(body),
     }).then(async r => {
       if (!r.ok) throw new Error((await r.text()) || `API ${r.status}`);
       return r.json() as Promise<{
         results: { id: string; text: string; label: string; probs: any }[];
         overall: { label: string; probs: any };
       }>;
     });
   
   const feedbackApi = (body: { id: string; correct: boolean; corrected_label?: string }) =>
     fetch(`${API_BASE}/feedback`, {
       method : "POST",
       headers: { "Content-Type": "application/json" },
       body   : JSON.stringify(body),
     }).then(async r => {
       if (!r.ok) throw new Error((await r.text()) || `API ${r.status}`);
       return r.json();
     });
   
   /* ─────────────────────────────────────────────────── */
   type Sentiment = "positive" | "neutral" | "negative";
   
   const NEUTRAL_MODELS = new Set<Model>(["roberta", "bertweet"]); // 3‑label ones
   
   /* ─────────────────────────────────────────────────── */
   const Index = () => {
     /* user‑chosen settings */
     const [model, setModel] = useState<Model>("roberta");
     const [mode , setMode ] = useState<"single" | "batch">("single");
   
     /* input text */
     const [text, setText] = useState("");
   
     /* prediction results */
     const [overall, setOverall] = useState<{ label: string; probs: any } | null>(null);
     const [items  , setItems  ] = useState<{ id: string; text: string; label: string }[]>([]);
     const [predId , setPredId ] = useState<string | null>(null);
   
     /* feedback UI */
     const [askFeedback , setAskFeedback ] = useState(false);
     const [feedbackStep, setFeedbackStep] = useState<"question"|"correction"|"done">("question");
     const [chosenLabel , setChosenLabel ] = useState<Sentiment>("positive");
   
     /** ----------------------------------------------------------------
      *  React‑Query: prediction
      *  ---------------------------------------------------------------- */
     const { mutate: predict, isLoading } = useMutation({
       mutationFn: async () => {
         if (mode === "batch") {
           const lines = text.split(/\r?\n/).filter(l => l.trim());
           return batchApi({ texts: lines, model });
         }
         return singleApi({ text, model });
       },
       onSuccess: (data) => {
         if (mode === "batch") {
           setOverall(data.overall);
           setItems(data.results);
           setPredId(null);          // no feedback in batch mode
         } else {
           setOverall(data);
           setItems([]);
           setPredId(data.id);
         }
       },
       onError: (e:any) => toast.error(e.message || "Prediction failed"),
     });
   
     /** ----------------------------------------------------------------
      *  React‑Query: feedback
      *  ---------------------------------------------------------------- */
     const { mutate: sendFeedback, isLoading: fbLoading } = useMutation({
       mutationFn: feedbackApi,
       onSuccess : () => {
         toast.success("Thanks for your feedback!");
         setFeedbackStep("done");
       },
       onError   : (e:any) => toast.error(e.message || "Couldn’t save feedback"),
     });
   
     /** ----------------------------------------------------------------
      *  Trigger prediction
      *  ---------------------------------------------------------------- */
     const run = () => {
       if (!text.trim()) return;
   
       if (mode === "batch") {
         const lines = text.split(/\r?\n/).filter(Boolean);
         if (lines.length > 10) {
           toast.error("Maximum 10 lines");
           return;
         }
       }
   
       /* wipe previous state */
       setOverall(null);
       setItems([]);
       setAskFeedback(false);
       setFeedbackStep("question");
       setPredId(null);
   
       predict();
     };
   
     /** ask feedback 3 s after result appears (single‑mode only) */
     useEffect(() => {
       if (predId && overall) {
         const t = setTimeout(() => setAskFeedback(true), 3000);
         return () => clearTimeout(t);
       }
     }, [predId, overall]);
   
     /** for current model, is “neutral” a valid label ? */
     const labelOptions = useMemo<Sentiment[]>(() =>
       NEUTRAL_MODELS.has(model) ? ["positive","neutral","negative"]
                                 : ["positive","negative"]
     , [model]);
   
     /* helpers for feedback buttons */
     const handleYes = () => predId && sendFeedback({ id: predId, correct: true });
     const handleNo  = () => setFeedbackStep("correction");
     const submitCorrection = () =>
       predId && sendFeedback({
         id: predId,
         correct: false,
         corrected_label: chosenLabel,
       });
   
     /* ---------------------------------------------------------------- */
     return (
       <main className="max-w-xl mx-auto p-4">
         <Header />
   
         {/* ── model selector + mode selector ─────────────────────────── */}
         <div className="space-y-4 mb-4">
           <ModelSelect model={model} setModel={setModel} />
   
           <div className="min-w-[140px]">
             <label htmlFor="mode-select" className="block text-sm font-medium text-gray-700 mb-1">
               Mode
             </label>
             <Select
               id="mode-select"
               value={mode}
               onValueChange={(v) => setMode(v as "single" | "batch")}
             >
               <SelectTrigger className="w-full">
                 <SelectValue placeholder="Select a mode" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="single">Single sentence</SelectItem>
                 <SelectItem value="batch" >Batch (≤ 10 lines)</SelectItem>
               </SelectContent>
             </Select>
           </div>
         </div>
   
         {/* ── text box + predict button ─────────────────────────────── */}
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
   
         {/* ── prediction output ─────────────────────────────────────── */}
         {overall && <ResultCard sentiment={overall.label as any} probs={overall.probs} />}
         {items.length > 0 && <BatchList items={items as any} />}
   
         {/* ── feedback widget (single‑mode only) ────────────────────── */}
         {askFeedback && feedbackStep === "question" && (
           <div className="mt-6 card border p-4 animate-fade-in flex flex-col items-center gap-3">
             <span className="font-medium">Was the prediction correct?</span>
             <div className="flex gap-3">
               <button className="btn btn-sm btn-primary" disabled={fbLoading} onClick={handleYes}>Yes</button>
               <button className="btn btn-sm btn-secondary" disabled={fbLoading} onClick={handleNo}>No</button>
             </div>
           </div>
         )}
   
         {askFeedback && feedbackStep === "correction" && (
           <div className="mt-6 card border p-4 animate-fade-in flex flex-col gap-3">
             <span className="font-medium text-center">What should it be?</span>
             <Select value={chosenLabel} onValueChange={(v)=>setChosenLabel(v as Sentiment)}>
               <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
               <SelectContent>
                 {labelOptions.map(opt => (
                   <SelectItem key={opt} value={opt}>{opt[0].toUpperCase() + opt.slice(1)}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
             <button className="btn btn-sm btn-primary self-center" disabled={fbLoading} onClick={submitCorrection}>
               Submit
             </button>
           </div>
         )}
   
         {feedbackStep === "done" && (
           <p className="mt-4 text-center text-sm text-muted-foreground">
             🎉 Thank you for helping us improve!
           </p>
         )}
   
         <Footer />
       </main>
     );
   };
   
   export default Index;
   
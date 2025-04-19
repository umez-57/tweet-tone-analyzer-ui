import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ── models supported by the backend ───────────────────────── */
export type Model =
  | "roberta"
  | "bertweet"
  | "roberta2L"
  | "bertweet2L";

type Props = {
  model: Model;
  setModel: React.Dispatch<React.SetStateAction<Model>>;
};

const ModelSelect = ({ model, setModel }: Props) => (
  <div className="mb-4">
    <label
      htmlFor="model-select"
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      Model
    </label>

    <Select
      value={model}
      onValueChange={(v) => setModel(v as Model)}
    >
      <SelectTrigger id="model-select" className="w-full">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="roberta">RoBERTa 3‑class</SelectItem>
        <SelectItem value="bertweet">BERTweet 3‑class</SelectItem>
        <SelectItem value="roberta2L">RoBERTa 2‑class</SelectItem>
        <SelectItem value="bertweet2L">BERTweet 2‑class</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

export default ModelSelect;
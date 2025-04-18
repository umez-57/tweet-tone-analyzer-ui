import { cn } from "@/lib/utils";

type Item = {
  text: string;
  label: "positive" | "neutral" | "negative";
};

const colors: Record<Item["label"], string> = {
  positive: "text-positive",
  neutral:  "text-neutral",
  negative: "text-negative",
};

const BatchList = ({ items }: { items: Item[] }) => (
  <div className="mt-6 border rounded-lg divide-y">
    {items.map((it, i) => (
      <div key={i} className="px-3 py-2 flex gap-2">
        <span className={cn("shrink-0 font-mono w-6", colors[it.label])}>
          {i + 1}.
        </span>
        <span className="flex-1 break-words">{it.text}</span>
        <span className={cn(colors[it.label], "shrink-0 capitalize font-medium")}>
          {it.label}
        </span>
      </div>
    ))}
  </div>
);

export default BatchList;

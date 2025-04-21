import { cn } from "@/lib/utils";

type Item = {
  text: string;
  label: "positive" | "neutral" | "negative";
};

/* use the same colour family as ResultCard --------------------------- */
const colors: Record<Item["label"], string> = {
  positive: "text-emerald-500",
  neutral : "text-yellow-500",
  negative: "text-rose-500",
};

const BatchList = ({ items }: { items: Item[] }) => (
  <div className="mt-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 divide-y">
    {items.map((it, i) => (
      
      <div
        
        key={i}
        className="px-4 py-2 flex gap-2 bg-white dark:bg-gray-900/40"
      >   
        <span className={cn("shrink-0 font-mono w-6", colors[it.label])}>
          {i + 1}.
        </span>
        <span className="flex-1 break-words text-gray-800 dark:text-gray-200">
          {it.text}
        </span>
        <span
          className={cn(
            colors[it.label],
            "shrink-0 capitalize font-medium text-right"
          )}
        >
          {it.label}
        </span>
      </div>
    ))}
  </div>
);

export default BatchList;

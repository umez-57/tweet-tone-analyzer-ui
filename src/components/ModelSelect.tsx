
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ModelSelectProps = {
  model: string;
  setModel: (model: string) => void;
};

const ModelSelect = ({ model, setModel }: ModelSelectProps) => {
  return (
    <div className="mb-4">
      <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 mb-1">
        Model
      </label>
      <Select value={model} onValueChange={setModel}>
        <SelectTrigger id="model-select" className="w-full">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="roberta">RoBERTa 3-class</SelectItem>
          <SelectItem value="bertweet">BERTweet 3-class</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ModelSelect;

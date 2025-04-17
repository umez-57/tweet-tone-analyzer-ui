
import React, { useState } from 'react';
import Header from '@/components/Header';
import ModelSelect from '@/components/ModelSelect';
import TextInput from '@/components/TextInput';
import PredictButton from '@/components/PredictButton';
import ResultCard from '@/components/ResultCard';
import Footer from '@/components/Footer';
import { useToast } from "@/components/ui/use-toast";
import { predictSentiment } from '@/services/sentimentService';

type SentimentLabel = "positive" | "neutral" | "negative" | null;

const Index = () => {
  const [model, setModel] = useState<string>('roberta');
  const [text, setText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sentiment, setSentiment] = useState<SentimentLabel>(null);
  const { toast } = useToast();

  const handleClassify = async () => {
    if (!text.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some text to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setSentiment(null);

    try {
      const result = await predictSentiment(text, model);
      setSentiment(result.label);
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Could not analyze sentiment",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 transition-colors duration-200 bg-gradient-dots">
      <div className="max-w-[500px] mx-auto">
        <div className="card glass">
          <Header />
          
          <ModelSelect model={model} setModel={setModel} />
          
          <TextInput 
            text={text} 
            setText={setText} 
            onClassify={handleClassify} 
          />
          
          <PredictButton 
            isLoading={isLoading} 
            disabled={!text.trim()} 
            onClick={handleClassify} 
          />
          
          <ResultCard sentiment={sentiment} />
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default Index;

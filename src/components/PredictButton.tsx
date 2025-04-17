
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

type PredictButtonProps = {
  isLoading: boolean;
  disabled: boolean;
  onClick: () => void;
};

const PredictButton = ({ isLoading, disabled, onClick }: PredictButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        'Classify'
      )}
    </Button>
  );
};

export default PredictButton;

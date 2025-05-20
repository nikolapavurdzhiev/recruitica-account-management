
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";

interface ContinueButtonProps {
  isSubmitting: boolean;
  onClick: () => void;
}

const ContinueButton = ({ isSubmitting, onClick }: ContinueButtonProps) => {
  return (
    <div className="fixed bottom-6 right-6">
      <Button 
        onClick={onClick}
        disabled={isSubmitting}
        size="lg"
        className="shadow-lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Confirm & Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};

export default ContinueButton;

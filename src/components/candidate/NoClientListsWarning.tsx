
import React from "react";
import { Button } from "@/components/ui/button";

interface NoClientListsWarningProps {
  onCreateList: () => void;
}

const NoClientListsWarning = ({ onCreateList }: NoClientListsWarningProps) => {
  return (
    <div className="w-full max-w-xl mx-auto p-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-primary">No Client Lists Found</h2>
        <p className="text-muted-foreground">
          You need at least one client list to submit a candidate.
        </p>
        <Button onClick={onCreateList}>
          Create Your First Client List
        </Button>
      </div>
    </div>
  );
};

export default NoClientListsWarning;


import React from "react";
import { Button } from "@/components/ui/button";

interface EmptyClientListProps {
  onCreateClick: () => void;
}

const EmptyClientList = ({ onCreateClick }: EmptyClientListProps) => {
  return (
    <div className="bg-card p-6 rounded-lg border shadow-sm text-center">
      <h3 className="font-semibold text-lg mb-2">No Client Lists Yet</h3>
      <p className="text-muted-foreground mb-4">
        Create your first client list to start managing your clients
      </p>
      <Button onClick={onCreateClick}>
        Create Your First List
      </Button>
    </div>
  );
};

export default EmptyClientList;

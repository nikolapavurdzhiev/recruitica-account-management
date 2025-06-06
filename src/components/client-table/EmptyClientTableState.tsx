
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

interface EmptyClientTableStateProps {
  onShowAddForm: () => void;
  onShowSearchModal: () => void;
}

const EmptyClientTableState = ({ onShowAddForm, onShowSearchModal }: EmptyClientTableStateProps) => {
  return (
    <div className="bg-muted/40 rounded-lg p-8 text-center">
      <h3 className="font-medium text-lg mb-2">No clients in this list</h3>
      <p className="text-muted-foreground mb-4">
        Add existing clients from the global pool or create new ones
      </p>
      <div className="flex gap-2 justify-center">
        <Button onClick={onShowSearchModal} variant="outline">
          <Search className="h-4 w-4 mr-2" />
          Browse Existing Clients
        </Button>
        <Button onClick={onShowAddForm}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Client
        </Button>
      </div>
    </div>
  );
};

export default EmptyClientTableState;

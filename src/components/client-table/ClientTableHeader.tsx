
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

interface ClientTableHeaderProps {
  onShowAddForm: () => void;
  onShowSearchModal: () => void;
}

const ClientTableHeader = ({ onShowAddForm, onShowSearchModal }: ClientTableHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold">Clients</h2>
      <div className="flex gap-2">
        <Button 
          onClick={onShowSearchModal} 
          size="sm" 
          variant="outline"
        >
          <Search className="h-4 w-4 mr-2" />
          Add Existing
        </Button>
        <Button onClick={onShowAddForm} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create New
        </Button>
      </div>
    </div>
  );
};

export default ClientTableHeader;

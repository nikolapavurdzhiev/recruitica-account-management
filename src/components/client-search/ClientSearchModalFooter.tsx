
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ClientSearchModalFooterProps {
  selectedCount: number;
  isAddingClients: boolean;
  onClose: () => void;
  onAddSelected: () => void;
}

const ClientSearchModalFooter = ({
  selectedCount,
  isAddingClients,
  onClose,
  onAddSelected
}: ClientSearchModalFooterProps) => {
  return (
    <div className="flex justify-between items-center pt-4 border-t">
      <div className="text-sm text-muted-foreground">
        {selectedCount > 0 && (
          <span>{selectedCount} client{selectedCount > 1 ? 's' : ''} selected</span>
        )}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        {selectedCount > 0 && (
          <Button 
            onClick={onAddSelected}
            disabled={isAddingClients}
          >
            {isAddingClients ? (
              "Adding..."
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Selected ({selectedCount})
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ClientSearchModalFooter;


import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface ClientSelectAllControlsProps {
  isAllSelected: boolean;
  isSomeSelected: boolean;
  availableClientsCount: number;
  selectedCount: number;
  onSelectAll: (checked: boolean) => void;
}

const ClientSelectAllControls = ({
  isAllSelected,
  isSomeSelected,
  availableClientsCount,
  selectedCount,
  onSelectAll
}: ClientSelectAllControlsProps) => {
  return (
    <div className="flex items-center space-x-2 mb-4 p-3 bg-muted/50 rounded-lg">
      <Checkbox
        checked={isAllSelected || isSomeSelected}
        onCheckedChange={onSelectAll}
        className={isSomeSelected && !isAllSelected ? "data-[state=checked]:bg-muted data-[state=checked]:opacity-50" : ""}
      />
      <span className="text-sm font-medium">
        Select All ({availableClientsCount} available)
      </span>
      {selectedCount > 0 && (
        <span className="text-sm text-muted-foreground">
          • {selectedCount} selected
        </span>
      )}
    </div>
  );
};

export default ClientSelectAllControls;


import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ClientListSelectorProps {
  clientLists: any[];
  selectedListId: string | null;
  onListChange: (listId: string) => void;
}

const ClientListSelector = ({ clientLists, selectedListId, onListChange }: ClientListSelectorProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="w-full max-w-xs">
        <Select value={selectedListId || ""} onValueChange={onListChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a client list" />
          </SelectTrigger>
          <SelectContent>
            {clientLists.map((list) => (
              <SelectItem key={list.id} value={list.id}>
                {list.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ClientListSelector;

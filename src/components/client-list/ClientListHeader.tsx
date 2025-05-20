
import React from "react";
import { Button } from "@/components/ui/button";

interface ClientListHeaderProps {
  showCreateForm: boolean;
  setShowCreateForm: (show: boolean) => void;
}

const ClientListHeader = ({ showCreateForm, setShowCreateForm }: ClientListHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-primary">Client Lists</h1>
      <Button onClick={() => setShowCreateForm(!showCreateForm)}>
        {showCreateForm ? "Cancel" : "Create New List"}
      </Button>
    </div>
  );
};

export default ClientListHeader;

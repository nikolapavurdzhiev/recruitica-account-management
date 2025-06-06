
import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { TableCell } from "@/components/ui/table";

interface Client {
  id: string;
  name: string;
  email: string;
  company_name: string;
  is_active: boolean;
}

interface ClientRowActionsProps {
  client: Client;
  onToggleClient: (clientId: string, currentValue: boolean) => void;
  onRemoveClient: (clientId: string, clientName: string) => void;
}

const ClientRowActions = ({ client, onToggleClient, onRemoveClient }: ClientRowActionsProps) => {
  return (
    <>
      <TableCell className="text-center">
        <Switch
          checked={client.is_active}
          onCheckedChange={() => onToggleClient(client.id, client.is_active)}
        />
      </TableCell>
      <TableCell className="text-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Client</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove <strong>{client.name}</strong> from this list? 
                This will only remove them from the current list, not from your client database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onRemoveClient(client.id, client.name)}>
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </>
  );
};

export default ClientRowActions;

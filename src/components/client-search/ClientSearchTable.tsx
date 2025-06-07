
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  company_name: string;
}

interface ClientSearchTableProps {
  clients: Client[];
  selectedClientIds: string[];
  addedClientIds: string[];
  onClientSelect: (clientId: string, checked: boolean) => void;
}

const ClientSearchTable = ({
  clients,
  selectedClientIds,
  addedClientIds,
  onClientSelect
}: ClientSearchTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">Select</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Company</TableHead>
          <TableHead className="w-[100px]">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => {
          const isAdded = addedClientIds.includes(client.id);
          const isSelected = selectedClientIds.includes(client.id);

          return (
            <TableRow key={client.id} className={isAdded ? "opacity-60" : ""}>
              <TableCell>
                {isAdded ? (
                  <div className="h-4 w-4 flex items-center justify-center">
                    <Plus className="h-3 w-3 text-green-600" />
                  </div>
                ) : (
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => onClientSelect(client.id, checked as boolean)}
                  />
                )}
              </TableCell>
              <TableCell className="font-medium">{client.name}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.company_name}</TableCell>
              <TableCell>
                {isAdded ? (
                  <span className="text-xs text-green-600 font-medium">Added</span>
                ) : (
                  <span className="text-xs text-muted-foreground">Available</span>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ClientSearchTable;


import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Plus } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  company_name: string;
}

interface ClientSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientListId: string;
  onClientAdded: (client: any) => void;
}

const ClientSearchModal = ({ isOpen, onClose, clientListId, onClientAdded }: ClientSearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingClientId, setAddingClientId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      searchClients();
    }
  }, [isOpen, searchQuery]);

  const searchClients = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('clients')
        .select('id, name, email, company_name')
        .order('name');

      if (searchQuery.trim()) {
        query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,company_name.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.limit(20);

      if (error) throw error;

      // Filter out clients already in the current list
      const { data: existingEntries, error: entriesError } = await supabase
        .from('client_list_entries')
        .select('client_id')
        .eq('client_list_id', clientListId);

      if (entriesError) throw entriesError;

      const existingClientIds = existingEntries?.map(entry => entry.client_id) || [];
      const availableClients = data?.filter(client => !existingClientIds.includes(client.id)) || [];

      setClients(availableClients);
    } catch (error: any) {
      toast.error(`Error searching clients: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addClientToList = async (client: Client) => {
    setAddingClientId(client.id);
    try {
      const { data: newEntry, error } = await supabase
        .from('client_list_entries')
        .insert({
          client_list_id: clientListId,
          client_id: client.id,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success(`${client.name} added to your list!`);
      onClientAdded({ ...client, entry: newEntry });
      
      // Remove the added client from the search results
      setClients(clients.filter(c => c.id !== client.id));
    } catch (error: any) {
      toast.error(`Error adding client: ${error.message}`);
    } finally {
      setAddingClientId(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Existing Clients</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, email, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="text-center py-8">Searching clients...</div>
            ) : clients.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? "No clients found matching your search." : "No available clients to add."}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead className="w-[100px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.company_name}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => addClientToList(client)}
                          disabled={addingClientId === client.id}
                        >
                          {addingClientId === client.id ? (
                            "Adding..."
                          ) : (
                            <>
                              <Plus className="h-3 w-3 mr-1" />
                              Add
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
        
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientSearchModal;

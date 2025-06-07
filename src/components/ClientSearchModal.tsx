
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
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
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [addedClientIds, setAddedClientIds] = useState<string[]>([]);
  const [isAddingClients, setIsAddingClients] = useState(false);

  useEffect(() => {
    if (isOpen) {
      searchClients();
      setSelectedClientIds([]);
      setAddedClientIds([]);
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

      const { data, error } = await query.limit(50);

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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const availableClientIds = clients
        .filter(client => !addedClientIds.includes(client.id))
        .map(client => client.id);
      setSelectedClientIds(availableClientIds);
    } else {
      setSelectedClientIds([]);
    }
  };

  const handleClientSelect = (clientId: string, checked: boolean) => {
    if (checked) {
      setSelectedClientIds(prev => [...prev, clientId]);
    } else {
      setSelectedClientIds(prev => prev.filter(id => id !== clientId));
    }
  };

  const addSelectedClients = async () => {
    if (selectedClientIds.length === 0) return;

    setIsAddingClients(true);
    try {
      // Batch insert all selected clients
      const entries = selectedClientIds.map(clientId => ({
        client_list_id: clientListId,
        client_id: clientId,
        is_active: true,
      }));

      const { data: newEntries, error } = await supabase
        .from('client_list_entries')
        .insert(entries)
        .select();

      if (error) throw error;

      // Update state to show these clients as added
      setAddedClientIds(prev => [...prev, ...selectedClientIds]);
      setSelectedClientIds([]);

      // Notify parent component about the additions
      const addedClients = clients.filter(client => selectedClientIds.includes(client.id));
      addedClients.forEach((client, index) => {
        onClientAdded({ ...client, entry: newEntries?.[index] });
      });

      toast.success(`${selectedClientIds.length} client${selectedClientIds.length > 1 ? 's' : ''} added to your list!`);
    } catch (error: any) {
      toast.error(`Error adding clients: ${error.message}`);
    } finally {
      setIsAddingClients(false);
    }
  };

  const availableClients = clients.filter(client => !addedClientIds.includes(client.id));
  const isAllSelected = availableClients.length > 0 && selectedClientIds.length === availableClients.length;
  const isSomeSelected = selectedClientIds.length > 0 && selectedClientIds.length < availableClients.length;

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
              <>
                {availableClients.length > 0 && (
                  <div className="flex items-center space-x-2 mb-4 p-3 bg-muted/50 rounded-lg">
                    <Checkbox
                      checked={isAllSelected || isSomeSelected}
                      onCheckedChange={handleSelectAll}
                      className={isSomeSelected && !isAllSelected ? "data-[state=checked]:bg-muted data-[state=checked]:opacity-50" : ""}
                    />
                    <span className="text-sm font-medium">
                      Select All ({availableClients.length} available)
                    </span>
                    {selectedClientIds.length > 0 && (
                      <span className="text-sm text-muted-foreground">
                        • {selectedClientIds.length} selected
                      </span>
                    )}
                  </div>
                )}

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
                                onCheckedChange={(checked) => handleClientSelect(client.id, checked as boolean)}
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
              </>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedClientIds.length > 0 && (
              <span>{selectedClientIds.length} client{selectedClientIds.length > 1 ? 's' : ''} selected</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {selectedClientIds.length > 0 && (
              <Button 
                onClick={addSelectedClients}
                disabled={isAddingClients}
              >
                {isAddingClients ? (
                  "Adding..."
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Selected ({selectedClientIds.length})
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientSearchModal;

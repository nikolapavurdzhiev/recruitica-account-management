
import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AddClientForm from "@/components/AddClientForm";

interface ClientTableProps {
  clientListId: string;
  onClientUpdate?: () => void;
}

interface Client {
  id: string;
  name: string;
  email: string;
  company_name: string;
  is_active: boolean;
}

const ClientTable = ({ clientListId, onClientUpdate }: ClientTableProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (clientListId) {
      fetchClients();
    }
  }, [clientListId]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      // First, fetch all clients that are part of this list
      const { data: entries, error: entriesError } = await supabase
        .from('client_list_entries')
        .select(`
          client_id,
          is_active,
          clients (
            id,
            name,
            email,
            company_name
          )
        `)
        .eq('client_list_id', clientListId);

      if (entriesError) throw entriesError;

      if (entries && entries.length > 0) {
        const formattedClients = entries.map((entry) => ({
          id: entry.clients.id,
          name: entry.clients.name,
          email: entry.clients.email,
          company_name: entry.clients.company_name,
          is_active: entry.is_active,
        }));
        
        setClients(formattedClients);
      } else {
        setClients([]);
      }
    } catch (error: any) {
      toast.error(`Error loading clients: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleClient = async (clientId: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('client_list_entries')
        .update({ is_active: !currentValue })
        .eq('client_list_id', clientListId)
        .eq('client_id', clientId);

      if (error) throw error;

      // Update local state
      setClients(
        clients.map((client) =>
          client.id === clientId ? { ...client, is_active: !currentValue } : client
        )
      );
      
      toast.success(`Client ${!currentValue ? 'added to' : 'removed from'} list`);
    } catch (error: any) {
      toast.error(`Error updating client: ${error.message}`);
    }
  };

  const handleAddClientSuccess = (newClientWithEntry: any) => {
    setShowAddForm(false);
    fetchClients();
    if (onClientUpdate) onClientUpdate();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Clients</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-card p-6 rounded-lg border shadow-sm mb-6">
          <AddClientForm
            clientListId={clientListId}
            onSuccess={handleAddClientSuccess}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">Loading clients...</div>
      ) : clients.length === 0 ? (
        <div className="bg-muted/40 rounded-lg p-8 text-center">
          <h3 className="font-medium text-lg mb-2">No clients in this list</h3>
          <p className="text-muted-foreground mb-4">
            Add your first client to get started
          </p>
          <Button onClick={() => setShowAddForm(true)}>Add Your First Client</Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="w-[100px] text-right">Include</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.company_name}</TableCell>
                <TableCell className="text-right">
                  <Switch
                    checked={client.is_active}
                    onCheckedChange={() => handleToggleClient(client.id, client.is_active)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ClientTable;

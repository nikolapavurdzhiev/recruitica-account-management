
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Client {
  id: string;
  name: string;
  email: string;
  company_name: string;
  is_active: boolean;
}

export const useClientTableData = (clientListId: string, onClientUpdate?: (activeClients: any[]) => void) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    setLoading(true);
    try {
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
        
        if (onClientUpdate) {
          onClientUpdate(formattedClients.filter(client => client.is_active));
        }
      } else {
        setClients([]);
        if (onClientUpdate) {
          onClientUpdate([]);
        }
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

      const updatedClients = clients.map((client) =>
        client.id === clientId ? { ...client, is_active: !currentValue } : client
      );
      
      setClients(updatedClients);
      
      if (onClientUpdate) {
        onClientUpdate(updatedClients.filter(client => client.is_active));
      }
      
      toast.success(`Client ${!currentValue ? 'added to' : 'removed from'} list`);
    } catch (error: any) {
      toast.error(`Error updating client: ${error.message}`);
    }
  };

  const handleRemoveClient = async (clientId: string, clientName: string) => {
    try {
      const { error } = await supabase
        .from('client_list_entries')
        .delete()
        .eq('client_list_id', clientListId)
        .eq('client_id', clientId);

      if (error) throw error;

      const updatedClients = clients.filter(client => client.id !== clientId);
      setClients(updatedClients);
      
      if (onClientUpdate) {
        onClientUpdate(updatedClients.filter(client => client.is_active));
      }
      
      toast.success(`${clientName} removed from list successfully`);
    } catch (error: any) {
      toast.error(`Error removing client: ${error.message}`);
    }
  };

  useEffect(() => {
    if (clientListId) {
      fetchClients();
    }
  }, [clientListId]);

  return {
    clients,
    loading,
    fetchClients,
    handleToggleClient,
    handleRemoveClient
  };
};


import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ClientTable from "@/components/ClientTable";
import CreateClientListForm from "@/components/CreateClientListForm";
import { toast } from "sonner";

const ClientListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [clientLists, setClientLists] = useState<any[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(id || null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchClientLists();
    }
  }, [user]);

  const fetchClientLists = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_lists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setClientLists(data || []);
      
      // If we have lists but no selected list, select the first one
      if (data && data.length > 0 && !selectedListId) {
        setSelectedListId(data[0].id);
      }

      setLoading(false);
    } catch (error: any) {
      toast.error(`Error loading client lists: ${error.message}`);
      setLoading(false);
    }
  };

  const handleListChange = (listId: string) => {
    setSelectedListId(listId);
    navigate(`/client-lists/${listId}`);
  };

  const handleCreateListSuccess = (newList: any) => {
    setClientLists([newList, ...clientLists]);
    setSelectedListId(newList.id);
    setShowCreateForm(false);
    navigate(`/client-lists/${newList.id}`);
    toast.success("Client list created successfully!");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">Client Lists</h1>
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              {showCreateForm ? "Cancel" : "Create New List"}
            </Button>
          </div>

          {showCreateForm ? (
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <CreateClientListForm onSuccess={handleCreateListSuccess} />
            </div>
          ) : clientLists.length === 0 && !loading ? (
            <div className="bg-card p-6 rounded-lg border shadow-sm text-center">
              <h3 className="font-semibold text-lg mb-2">No Client Lists Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first client list to start managing your clients
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                Create Your First List
              </Button>
            </div>
          ) : (
            <>
              {clientLists.length > 0 && (
                <div className="flex items-center gap-4">
                  <div className="w-full max-w-xs">
                    <Select value={selectedListId || ""} onValueChange={handleListChange}>
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
              )}

              {selectedListId && <ClientTable clientListId={selectedListId} onClientUpdate={fetchClientLists} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClientListPage;

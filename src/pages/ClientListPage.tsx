
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import ClientTable from "@/components/ClientTable";
import CreateClientListForm from "@/components/CreateClientListForm";
import { toast } from "sonner";
import ClientListHeader from "@/components/client-list/ClientListHeader";
import EmptyClientList from "@/components/client-list/EmptyClientList";
import ClientListSelector from "@/components/client-list/ClientListSelector";
import { useClientLists } from "@/hooks/useClientLists";

const ClientListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const { clientLists, loading, fetchClientLists, setClientLists } = useClientLists(user?.id);
  
  const [selectedListId, setSelectedListId] = useState<string | null>(id || null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeClients, setActiveClients] = useState<any[]>([]);

  useEffect(() => {
    // If we have lists but no selected list, select the first one
    if (clientLists.length > 0 && !selectedListId) {
      setSelectedListId(clientLists[0].id);
    }
  }, [clientLists, selectedListId]);

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

  const onClientUpdate = (updatedClients: any[]) => {
    setActiveClients(updatedClients.filter(client => client.is_active));
    fetchClientLists();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="flex flex-col space-y-6">
          <ClientListHeader 
            showCreateForm={showCreateForm} 
            setShowCreateForm={setShowCreateForm} 
          />

          {showCreateForm ? (
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <CreateClientListForm onSuccess={handleCreateListSuccess} />
            </div>
          ) : clientLists.length === 0 && !loading ? (
            <EmptyClientList onCreateClick={() => setShowCreateForm(true)} />
          ) : (
            <>
              {clientLists.length > 0 && (
                <ClientListSelector
                  clientLists={clientLists}
                  selectedListId={selectedListId}
                  onListChange={handleListChange}
                />
              )}

              {selectedListId && (
                <ClientTable 
                  clientListId={selectedListId} 
                  onClientUpdate={onClientUpdate} 
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClientListPage;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import ClientTable from "@/components/ClientTable";
import CreateClientListForm from "@/components/CreateClientListForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import EmptyClientList from "@/components/client-list/EmptyClientList";
import ClientListSelector from "@/components/client-list/ClientListSelector";
import ContinueButton from "@/components/client-list/ContinueButton";
import { useClientLists } from "@/hooks/useClientLists";
import { useLatestCandidate } from "@/hooks/useLatestCandidate";
import { WebhookData } from "@/services/webhookService";
import { useWebhookMutation } from "@/hooks/useWebhookMutation";

const CandidateClientSelectionPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { clientLists, loading, fetchClientLists, setClientLists } = useClientLists(user?.id);
  const { latestCandidate } = useLatestCandidate(user?.id);
  const webhookMutation = useWebhookMutation();
  
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
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
  };

  const handleCreateListSuccess = (newList: any) => {
    setClientLists([newList, ...clientLists]);
    setSelectedListId(newList.id);
    setShowCreateForm(false);
    toast.success("Client list created successfully!");
  };

  const onClientUpdate = (updatedClients: any[]) => {
    setActiveClients(updatedClients.filter(client => client.is_active));
    fetchClientLists();
  };

  const handleContinueClick = async () => {
    if (!latestCandidate) {
      toast.error("No candidate data found. Please submit a candidate first.");
      return;
    }

    if (activeClients.length === 0) {
      toast.error("Please select at least one client before continuing.");
      return;
    }

    // Prepare webhook data
    const webhookData: WebhookData = {
      candidateName: latestCandidate.candidate_name,
      keynotesFile: latestCandidate.keynotes_url,
      contacts: activeClients.map(client => ({
        name: client.name,
        email: client.email,
        company: client.company_name
      }))
    };

    // Use the webhook mutation to send data and get response
    webhookMutation.mutate(webhookData, {
      onSuccess: (data) => {
        // Navigate to the email tune-up page with the HTML data AND client list
        navigate(`/email-tuneup/${encodeURIComponent(latestCandidate.candidate_name)}`, {
          state: {
            html: data.html,
            candidateName: latestCandidate.candidate_name,
            contacts: activeClients.map(client => ({
              name: client.name,
              email: client.email,
              company: client.company_name
            }))
          }
        });
      },
      onError: (error: any) => {
        console.error("Webhook error:", error);
        
        toast.error(
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> 
              Webhook request failed
            </div>
            <div className="text-sm text-muted-foreground">{error.message}</div>
            <div className="text-sm">You can try again when ready.</div>
          </div>
        );
      }
    });
  };

  if (!user) {
    return null;
  }

  // Determine if Continue button should be shown
  const shouldShowContinueButton = selectedListId && 
    activeClients.length > 0 && 
    latestCandidate;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Select Clients for Candidate</h1>
              <p className="text-muted-foreground">
                {latestCandidate ? 
                  `Choose which clients to contact about: ${latestCandidate.candidate_name}` : 
                  "Loading candidate information..."
                }
              </p>
            </div>
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              {showCreateForm ? "Cancel" : "Create New List"}
            </Button>
          </div>

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

      {/* Continue button - always show when conditions are met */}
      {shouldShowContinueButton && (
        <ContinueButton 
          isSubmitting={webhookMutation.isPending}
          onClick={handleContinueClick}
        />
      )}
    </div>
  );
};

export default CandidateClientSelectionPage;


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
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";

const ClientListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [clientLists, setClientLists] = useState<any[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(id || null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeClients, setActiveClients] = useState<any[]>([]);
  const [latestCandidate, setLatestCandidate] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchClientLists();
      fetchLatestCandidate();
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

  const fetchLatestCandidate = async () => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      if (data && data.length > 0) {
        setLatestCandidate(data[0]);
      }
    } catch (error: any) {
      console.error(`Error loading latest candidate:`, error);
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

    setIsSubmitting(true);
    
    try {
      // Prepare webhook data
      const webhookData = {
        candidateName: latestCandidate.candidate_name,
        keynotesFile: latestCandidate.keynotes_url,
        contacts: activeClients.map(client => ({
          name: client.name,
          email: client.email,
          company: client.company_name
        }))
      };

      console.log("Sending webhook data:", webhookData);
      
      // Send the webhook and wait for the response
      const response = await fetch(
        'https://nikolapavurdjiev.app.n8n.cloud/webhook-test/c1f76bc0-d38a-4b5f-aeae-87578650912b',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add CORS headers if needed
            'Accept': 'application/json'
          },
          body: JSON.stringify(webhookData),
        }
      );

      console.log("Webhook response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`Webhook request failed with status ${response.status}`);
      }
      
      // Try to parse the response if there is one
      let responseData;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          responseData = await response.json();
          console.log("Webhook response data:", responseData);
        } catch (e) {
          console.log("Could not parse JSON response:", e);
        }
      } else {
        const textResponse = await response.text();
        console.log("Webhook text response:", textResponse);
      }

      // Only show success and redirect after the webhook has fully processed
      toast.success("Workflow completed successfully!");
      
      // Navigate to candidate submit page after the successful webhook response
      navigate('/candidate/submit');
      
    } catch (error: any) {
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
    } finally {
      setIsSubmitting(false);
    }
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

      {/* Fixed position continue button with loading state */}
      {selectedListId && activeClients.length > 0 && latestCandidate && (
        <div className="fixed bottom-6 right-6">
          <Button 
            onClick={handleContinueClick}
            disabled={isSubmitting}
            size="lg"
            className="shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Confirm & Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ClientListPage;

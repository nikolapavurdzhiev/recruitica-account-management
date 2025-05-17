
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
import { FileText, MessageSquare } from "lucide-react";

const ClientListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [clientLists, setClientLists] = useState<any[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(id || null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  useEffect(() => {
    if (user) {
      fetchClientLists();
    }
  }, [user]);

  useEffect(() => {
    if (selectedListId) {
      fetchCandidatesForList(selectedListId);
    }
  }, [selectedListId]);

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

  const fetchCandidatesForList = async (listId: string) => {
    setLoadingCandidates(true);
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('client_list_id', listId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCandidates(data || []);
      
      // Select the first candidate by default
      if (data && data.length > 0) {
        setSelectedCandidateId(data[0].id);
      } else {
        setSelectedCandidateId(null);
      }
      
      setLoadingCandidates(false);
    } catch (error: any) {
      console.error("Error loading candidates:", error);
      setLoadingCandidates(false);
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

  const handleCandidateChange = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
  };

  const handleGenerateEmail = () => {
    if (!selectedCandidateId) {
      toast.error("Please select a candidate first");
      return;
    }
    navigate(`/candidate-intro/${selectedCandidateId}`);
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
                <div className="flex flex-col md:flex-row md:items-end gap-4">
                  <div className="w-full md:w-1/3">
                    <label className="text-sm font-medium mb-1 block">Select Client List</label>
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
                  
                  {candidates.length > 0 && (
                    <div className="w-full md:w-1/3">
                      <label className="text-sm font-medium mb-1 block">Select Candidate</label>
                      <Select 
                        value={selectedCandidateId || ""} 
                        onValueChange={handleCandidateChange}
                        disabled={loadingCandidates}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={loadingCandidates ? "Loading candidates..." : "Select a candidate"} />
                        </SelectTrigger>
                        <SelectContent>
                          {candidates.map((candidate) => (
                            <SelectItem key={candidate.id} value={candidate.id}>
                              {candidate.candidate_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div>
                    <Button 
                      onClick={handleGenerateEmail} 
                      disabled={!selectedCandidateId}
                      className="md:ml-2"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Generate Email Template
                    </Button>
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

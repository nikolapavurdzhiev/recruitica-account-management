
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import CandidateFormFields, { CandidateFormValues } from "./candidate/CandidateFormFields";
import SubmitSuccess from "./candidate/SubmitSuccess";
import NoClientListsWarning from "./candidate/NoClientListsWarning";

const CandidateForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Move all useState hooks to the top of the component
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientLists, setClientLists] = useState<any[]>([]);
  const [hasClientLists, setHasClientLists] = useState<boolean | null>(null);
  const [loadingLists, setLoadingLists] = useState(true);
  
  // Fetch client lists when component mounts
  useEffect(() => {
    // Only fetch if we have a user
    if (!user) return;
    
    const fetchClientLists = async () => {
      try {
        const { data, error } = await supabase
          .from('client_lists')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setClientLists(data || []);
        setHasClientLists(data && data.length > 0);
        setLoadingLists(false);
      } catch (error: any) {
        console.error('Error fetching client lists:', error);
        toast.error(`Error loading client lists: ${error.message}`);
        setLoadingLists(false);
      }
    };
    
    fetchClientLists();
  }, [user]); // Only re-run when user changes

  const handleGoToCreateList = () => {
    navigate('/client-lists');
  };

  const handleSubmit = async (data: CandidateFormValues) => {
    if (!user) {
      toast.error("You must be logged in to submit a candidate");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Upload file to Supabase storage
      let keynotes_url = null;
      if (data.keynotes) {
        const fileExt = data.keynotes.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        
        // Structure the file path with user ID as prefix for RLS policies
        const filePath = `${user.id}/${fileName}`;
        
        // Upload to the candidate-documents bucket
        const { error: uploadError, data: fileData } = await supabase.storage
          .from('candidate-documents')
          .upload(filePath, data.keynotes);
        
        if (uploadError) {
          throw uploadError;
        }
        
        // Get the URL for the uploaded file
        const { data: urlData } = supabase.storage
          .from('candidate-documents')
          .getPublicUrl(filePath);
          
        keynotes_url = urlData.publicUrl;
      }
      
      // Insert the candidate record linked to the current user
      const { error } = await supabase
        .from('candidates')
        .insert({
          user_id: user.id,
          candidate_name: data.candidateName,
          keynotes_url,
          client_list: data.clientList, // Keep for backwards compatibility
          client_list_id: data.clientList, // New field with the UUID of the selected client list
        });
        
      if (error) {
        throw error;
      }
      
      toast.success("Candidate submitted successfully!");
      setIsSubmitted(true);
      
      // Redirect to the client list page
      setTimeout(() => {
        navigate(`/client-lists/${data.clientList}`);
      }, 1500);
      
    } catch (error: any) {
      toast.error(error.message || "An error occurred while submitting the candidate");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Move conditional rendering after all hooks are defined
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (isSubmitted) {
    return <SubmitSuccess />;
  }

  if (hasClientLists === false && !loadingLists) {
    return <NoClientListsWarning onCreateList={handleGoToCreateList} />;
  }

  return (
    <div className="w-full max-w-xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Candidate Submission</h1>
        <p className="text-muted-foreground">Add a new candidate to the database</p>
      </div>
      
      <CandidateFormFields
        clientLists={clientLists}
        loadingLists={loadingLists}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        handleGoToCreateList={handleGoToCreateList}
      />
    </div>
  );
};

export default CandidateForm;

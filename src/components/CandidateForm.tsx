
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navigate, useNavigate } from "react-router-dom";

const formSchema = z.object({
  candidateName: z.string().min(2, {
    message: "Candidate name must be at least 2 characters."
  }),
  keynotes: z.instanceof(File, {
    message: "Candidate keynotes file is required."
  }),
  clientList: z.string({
    required_error: "Please select a client list."
  })
});

type FormValues = z.infer<typeof formSchema>;

const CandidateForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientLists, setClientLists] = useState<any[]>([]);
  const [hasClientLists, setHasClientLists] = useState<boolean | null>(null);
  const [loadingLists, setLoadingLists] = useState(true);

  // Redirect to auth page if user is not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Fetch client lists when component mounts
  useEffect(() => {
    const fetchClientLists = async () => {
      if (!user) return;
      
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
  }, [user]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      candidateName: "",
      clientList: ""
    }
  });

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error("You must be logged in to submit a candidate");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Upload file to Supabase storage
      let keynotes_url = null;
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        
        // Structure the file path with user ID as prefix for RLS policies
        const filePath = `${user.id}/${fileName}`;
        
        // Upload to the candidate-documents bucket
        const { error: uploadError, data: fileData } = await supabase.storage
          .from('candidate-documents')
          .upload(filePath, selectedFile);
        
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check if file is PDF or Word document
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (validTypes.includes(file.type)) {
        setSelectedFile(file);
        // Set the keynotes field value in the form
        form.setValue("keynotes", file, { shouldValidate: true });
      } else {
        toast.error("Please upload a PDF or Word document");
        event.target.value = "";
        form.setError("keynotes", { message: "Please upload a PDF or Word document" });
      }
    }
  };

  const handleGoToCreateList = () => {
    navigate('/client-lists');
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
        <div className="rounded-full bg-green-100 p-3">
          <svg 
            className="h-6 w-6 text-green-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-primary">Congratulations!</h2>
        <p className="text-lg">You just submitted a candidate</p>
        <p className="text-sm text-muted-foreground">Redirecting to client list...</p>
      </div>
    );
  }

  if (hasClientLists === false && !loadingLists) {
    return (
      <div className="w-full max-w-xl mx-auto p-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-primary">No Client Lists Found</h2>
          <p className="text-muted-foreground">
            You need at least one client list to submit a candidate.
          </p>
          <Button onClick={handleGoToCreateList}>
            Create Your First Client List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Candidate Submission</h1>
        <p className="text-muted-foreground">Add a new candidate to the database</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="candidateName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Candidate Name *</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="keynotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Candidate Keynotes *</FormLabel>
                <div className="flex items-center gap-2">
                  <Label 
                    htmlFor="keynotes"
                    className="flex h-10 w-full cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium hover:bg-accent hover:text-accent-foreground"
                  >
                    <FileText className="h-4 w-4" />
                    {selectedFile ? selectedFile.name : "Upload PDF or Word"}
                  </Label>
                </div>
                <input
                  id="keynotes"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="sr-only"
                  onChange={handleFileChange}
                />
                <FormDescription className="text-xs text-muted-foreground">Upload a PDF or Word document</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="clientList"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client List *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={loadingLists ? "Loading client lists..." : "Select a client list"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clientLists.map(list => (
                      <SelectItem key={list.id} value={list.id}>
                        {list.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription className="text-xs">
                  {hasClientLists ? (
                    <span>Select which client list this candidate applies to</span>
                  ) : (
                    <span className="flex items-center">
                      <Button 
                        variant="link" 
                        className="h-auto p-0 text-xs" 
                        onClick={handleGoToCreateList}
                      >
                        Click here to create your first client list
                      </Button>
                    </span>
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isSubmitting || loadingLists || hasClientLists === false}>
            {isSubmitting ? "Submitting..." : "Submit Candidate"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CandidateForm;


import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FileText } from "lucide-react";
import { toast } from "sonner";

// Schema for form validation
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

export type CandidateFormValues = z.infer<typeof formSchema>;

interface CandidateFormFieldsProps {
  clientLists: any[];
  loadingLists: boolean;
  onSubmit: (data: CandidateFormValues) => Promise<void>;
  isSubmitting: boolean;
  handleGoToCreateList: () => void;
}

const CandidateFormFields = ({ 
  clientLists, 
  loadingLists, 
  onSubmit, 
  isSubmitting, 
  handleGoToCreateList 
}: CandidateFormFieldsProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const hasClientLists = clientLists.length > 0;
  
  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      candidateName: "",
      clientList: ""
    }
  });

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

  return (
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
        
        <Button type="submit" className="w-full" disabled={isSubmitting || loadingLists || !hasClientLists}>
          {isSubmitting ? "Submitting..." : "Submit Candidate"}
        </Button>
      </form>
    </Form>
  );
};

export default CandidateFormFields;

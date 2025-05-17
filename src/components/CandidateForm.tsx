
import React, { useState } from "react";
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

const formSchema = z.object({
  candidateName: z.string().min(2, {
    message: "Candidate name must be at least 2 characters."
  }),
  keynotes: z.instanceof(File).optional(),
  clientList: z.string({
    required_error: "Please select a client."
  })
});

type FormValues = z.infer<typeof formSchema>;

const CandidateForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      candidateName: "",
      clientList: ""
    }
  });

  const onSubmit = (data: FormValues) => {
    // Handle file separately since it's not directly handled by react-hook-form
    const formData = {
      ...data,
      keynotes: selectedFile
    };
    
    console.log("Form submitted:", formData);
    toast.success("Form submitted successfully!");
    setIsSubmitted(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check if file is PDF or Word document
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (validTypes.includes(file.type)) {
        setSelectedFile(file);
      } else {
        toast.error("Please upload a PDF or Word document");
        event.target.value = "";
      }
    }
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
        <Button 
          onClick={() => {
            form.reset();
            setSelectedFile(null);
            setIsSubmitted(false);
          }}
        >
          Submit another candidate
        </Button>
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
          
          <div className="space-y-2">
            <Label htmlFor="keynotes">Candidate Keynotes</Label>
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
            <p className="text-xs text-muted-foreground">Upload a PDF or Word document</p>
          </div>
          
          <FormField
            control={form.control}
            name="clientList"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client List *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="it-london">IT London</SelectItem>
                    <SelectItem value="finance-london">Finance London</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full">Submit Candidate</Button>
        </form>
      </Form>
    </div>
  );
};

export default CandidateForm;

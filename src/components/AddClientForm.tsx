
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Client name must be at least 2 characters."
  }),
  email: z.string().email({
    message: "Please enter a valid email address."
  }),
  company_name: z.string().min(2, {
    message: "Company name must be at least 2 characters."
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddClientFormProps {
  clientListId: string;
  onSuccess: (client: any) => void;
  onCancel: () => void;
}

const AddClientForm = ({ clientListId, onSuccess, onCancel }: AddClientFormProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company_name: "",
    },
  });

  const checkForDuplicateClient = async (email: string) => {
    const { data, error } = await supabase
      .from('clients')
      .select('id, name, email, company_name')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Error checking for duplicate:', error);
      return null;
    }

    return data;
  };

  const addExistingClientToList = async (existingClient: any) => {
    // Check if client is already in this list
    const { data: existingEntry, error: checkError } = await supabase
      .from('client_list_entries')
      .select('id')
      .eq('client_list_id', clientListId)
      .eq('client_id', existingClient.id)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing entry:', checkError);
      throw checkError;
    }

    if (existingEntry) {
      throw new Error('This client is already in your list');
    }

    // Add existing client to the list
    const { data: newEntry, error: entryError } = await supabase
      .from('client_list_entries')
      .insert({
        client_list_id: clientListId,
        client_id: existingClient.id,
        is_active: true,
      })
      .select()
      .single();

    if (entryError) throw entryError;

    return { ...existingClient, entry: newEntry };
  };

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error("You must be logged in to add a client");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // First, check if a client with this email already exists
      setIsCheckingDuplicate(true);
      const existingClient = await checkForDuplicateClient(data.email);
      setIsCheckingDuplicate(false);

      if (existingClient) {
        // Client exists, add them to the list instead of creating a new one
        const clientWithEntry = await addExistingClientToList(existingClient);
        toast.success(`Existing client "${existingClient.name}" added to your list!`);
        onSuccess(clientWithEntry);
        form.reset();
        return;
      }

      // Client doesn't exist, create a new global client
      const { data: newClient, error: clientError } = await supabase
        .from('clients')
        .insert({
          name: data.name,
          email: data.email,
          company_name: data.company_name,
          created_by_user_id: user.id,
        })
        .select()
        .single();

      if (clientError) throw clientError;
      
      // Then, add the new client to the current list
      const { data: newEntry, error: entryError } = await supabase
        .from('client_list_entries')
        .insert({
          client_list_id: clientListId,
          client_id: newClient.id,
          is_active: true,
        })
        .select()
        .single();

      if (entryError) throw entryError;
      
      toast.success("New client created and added to your list!");
      onSuccess({ ...newClient, entry: newEntry });
      form.reset();
    } catch (error: any) {
      toast.error(`Error adding client: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setIsCheckingDuplicate(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john.doe@company.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Acme Corp" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || isCheckingDuplicate}>
            {isCheckingDuplicate ? "Checking..." : isSubmitting ? "Adding..." : "Add Client"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddClientForm;

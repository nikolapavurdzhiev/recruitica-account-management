
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
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company_name: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error("You must be logged in to add a client");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // First, create a new client
      const { data: newClient, error: clientError } = await supabase
        .from('clients')
        .insert({
          user_id: user.id,
          name: data.name,
          email: data.email,
          company_name: data.company_name,
        })
        .select()
        .single();

      if (clientError) throw clientError;
      
      // Then, create the entry in the client_list_entries table
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
      
      toast.success("Client added successfully!");
      onSuccess({ ...newClient, entry: newEntry });
      form.reset();
    } catch (error: any) {
      toast.error(`Error adding client: ${error.message}`);
    } finally {
      setIsSubmitting(false);
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Client"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddClientForm;

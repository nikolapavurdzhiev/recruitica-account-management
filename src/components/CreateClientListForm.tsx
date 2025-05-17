
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Client list name must be at least 2 characters."
  }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateClientListFormProps {
  onSuccess: (clientList: any) => void;
}

const CreateClientListForm = ({ onSuccess }: CreateClientListFormProps) => {
  const { user } = useAuth();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error("You must be logged in to create a client list");
      return;
    }

    try {
      const { data: clientList, error } = await supabase
        .from('client_lists')
        .insert({
          user_id: user.id,
          name: data.name,
          description: data.description || null,
        })
        .select()
        .single();

      if (error) throw error;
      
      if (clientList) {
        onSuccess(clientList);
        form.reset();
      }
    } catch (error: any) {
      toast.error(`Error creating client list: ${error.message}`);
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
              <FormLabel>List Name</FormLabel>
              <FormControl>
                <Input placeholder="IT Clients London" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="List description..." 
                  className="resize-none" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                A brief description of this client list
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Create Client List
        </Button>
      </form>
    </Form>
  );
};

export default CreateClientListForm;

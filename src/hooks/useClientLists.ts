
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useClientLists = (userId: string | undefined) => {
  const [clientLists, setClientLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClientLists = async () => {
    if (!userId) {
      setLoading(false);
      return [];
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_lists')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setClientLists(data || []);
      setLoading(false);
      return data;
    } catch (error: any) {
      toast.error(`Error loading client lists: ${error.message}`);
      setLoading(false);
      return [];
    }
  };

  useEffect(() => {
    if (userId) {
      fetchClientLists();
    }
  }, [userId]);

  return { clientLists, loading, fetchClientLists, setClientLists };
};

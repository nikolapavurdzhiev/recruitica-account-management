
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useLatestCandidate = (userId: string | undefined) => {
  const [latestCandidate, setLatestCandidate] = useState<any>(null);

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

  useEffect(() => {
    if (userId) {
      fetchLatestCandidate();
    }
  }, [userId]);

  return { latestCandidate };
};

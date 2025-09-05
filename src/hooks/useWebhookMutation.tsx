
import React from 'react';
import { useMutation } from "@tanstack/react-query";
import { sendWebhook, WebhookData, WebhookResponse } from "@/services/webhookService";
import { toast } from "sonner";
import { AlertCircle, Clock } from "lucide-react";

export const useWebhookMutation = () => {
  const mutation = useMutation({
    mutationFn: async (data: WebhookData) => {
      console.log("Starting webhook mutation with data:", data);
      return await sendWebhook(data);
    },
    onSuccess: (data: WebhookResponse) => {
      console.log("Webhook mutation succeeded with response:", data);
    },
    onError: (error: Error) => {
      console.error("Webhook mutation failed:", error);
      
      toast.error(
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span className="font-bold">Email generation failed</span>
          </div>
          <div className="text-sm text-muted-foreground">{error.message}</div>
          <div className="text-sm">You can try again when ready.</div>
        </div>
      );
    }
  });

  return mutation;
};

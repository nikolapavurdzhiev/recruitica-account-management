
import React from 'react';
import { useMutation } from "@tanstack/react-query";
import { sendWebhook, WebhookData, WebhookResponse } from "@/services/webhookService";
import { toast } from "sonner";
import { AlertCircle, Clock } from "lucide-react";

export const useWebhookMutation = () => {
  const mutation = useMutation({
    mutationFn: async (data: WebhookData) => {
      return await sendWebhook(data);
    },
    onError: (error: Error) => {
      // Check if this is a timeout error
      const isTimeoutError = error.message.includes('timed out');
      
      toast.error(
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {isTimeoutError ? <Clock className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <span className="font-bold">
              {isTimeoutError ? "Webhook request timed out" : "Webhook request failed"}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">{error.message}</div>
          <div className="text-sm">
            {isTimeoutError 
              ? "n8n workflow may still be processing. Please check your email in a few minutes or try again." 
              : "You can try again when ready."}
          </div>
        </div>
      );
    }
  });

  return mutation;
};


import { useMutation } from "@tanstack/react-query";
import { sendWebhook, WebhookData, WebhookResponse } from "@/services/webhookService";
import { toast } from "sonner";

export const useWebhookMutation = () => {
  const mutation = useMutation({
    mutationFn: async (data: WebhookData) => {
      return await sendWebhook(data);
    },
    onError: (error: Error) => {
      toast.error(
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold">Webhook request failed</span>
          </div>
          <div className="text-sm text-muted-foreground">{error.message}</div>
          <div className="text-sm">You can try again when ready.</div>
        </div>
      );
    }
  });

  return mutation;
};

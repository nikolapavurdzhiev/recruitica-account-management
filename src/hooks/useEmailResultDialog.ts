
import { useState } from "react";
import { WebhookResponse } from "@/services/webhookService";

export const useEmailResultDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [emailData, setEmailData] = useState<WebhookResponse | undefined>(undefined);

  const openDialog = (data: WebhookResponse) => {
    setEmailData(data);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return {
    isDialogOpen,
    emailData,
    openDialog,
    closeDialog
  };
};

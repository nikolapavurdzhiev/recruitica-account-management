
import { useState } from "react";
import { WebhookResponse } from "@/services/webhookService";

export const useEmailResultDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [emailData, setEmailData] = useState<WebhookResponse | undefined>(undefined);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const openDialog = (data: WebhookResponse) => {
    setEmailData(data);
    setIsDialogOpen(true);
    setHasConfirmed(false);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const confirmAndCloseDialog = () => {
    setHasConfirmed(true);
    setIsDialogOpen(false);
  };

  return {
    isDialogOpen,
    emailData,
    hasConfirmed,
    openDialog,
    closeDialog,
    confirmAndCloseDialog
  };
};

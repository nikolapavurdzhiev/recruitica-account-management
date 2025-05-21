
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Copy, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WebhookResponse } from "@/services/webhookService";
import { AI_MODELS, tuneEmail } from "@/services/emailTuningService";
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface EmailResultDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: WebhookResponse | undefined;
  isLoading: boolean;
}

const EmailResultDialog: React.FC<EmailResultDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  data,
  isLoading
}) => {
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].value);
  const [emailBody, setEmailBody] = useState("");
  const [isTuning, setIsTuning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tuningError, setTuningError] = useState<string | null>(null);
  
  // Set email body when data changes
  useEffect(() => {
    if (data?.emailBody) {
      console.log("Setting email body from data:", data.emailBody.substring(0, 50) + "...");
      setEmailBody(data.emailBody);
      setTuningError(null); // Reset error state when new data arrives
    }
  }, [data?.emailBody]);

  const handleTuneEmail = async () => {
    if (!emailBody) {
      toast.error("No email content to tune");
      return;
    }
    
    setTuningError(null);
    setIsTuning(true);
    
    try {
      console.log(`Tuning email with model: ${selectedModel}`);
      const refinedEmail = await tuneEmail({
        model: selectedModel,
        emailBody
      });
      
      setEmailBody(refinedEmail);
      toast.success("Email polished successfully.");
    } catch (error: any) {
      console.error("Tuning error:", error);
      setTuningError(error.message || "Failed to tune email");
      toast.error(`Failed to tune email: ${error.message}`);
    } finally {
      setIsTuning(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Email copied to clipboard");
  };

  const handleModelChange = (value: string) => {
    console.log(`Model changed to: ${value}`);
    setSelectedModel(value);
  };

  // Handle dialog open state changes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  // Handle confirmation explicitly
  const handleConfirmClick = () => {
    onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Email Generated Successfully</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Processing email...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 py-4">
              <Card>
                <CardHeader>
                  <CardTitle>{data?.emailSubject || "Subject"}</CardTitle>
                </CardHeader>
                <CardContent>
                  {tuningError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertTitle>Error tuning email</AlertTitle>
                      <AlertDescription>{tuningError}</AlertDescription>
                    </Alert>
                  )}
                  <ScrollArea className="h-[300px] rounded-md border p-4">
                    <div className="whitespace-pre-wrap">{emailBody}</div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center space-x-2">
                    <Select value={selectedModel} onValueChange={handleModelChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        {AI_MODELS.map((model) => (
                          <SelectItem key={model.value} value={model.value}>
                            {model.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleTuneEmail} 
                      disabled={isTuning || !emailBody}
                    >
                      {isTuning ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Tuning...
                        </>
                      ) : (
                        "Tune Up"
                      )}
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleCopyEmail} 
                    disabled={!emailBody}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span className="ml-2">{copied ? "Copied" : "Copy Email"}</span>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <DialogFooter>
              <Button onClick={handleConfirmClick}>Close & Continue</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmailResultDialog;

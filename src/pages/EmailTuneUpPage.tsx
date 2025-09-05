import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Loader2, ArrowLeft, Eye, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { getAvailableModels, AIModel } from "@/services/emailTuningService";
import { sendFinalizedEmailWebhook, WebhookContact } from "@/services/webhookService";
import { tuneHTMLEmail } from "@/services/htmlEmailTuningService";
import EmailPreview from "@/components/email-result/EmailPreview";
import ChatInterface from "@/components/email-result/ChatInterface";

interface EmailData {
  html: string;
  candidateName: string;
  contacts?: WebhookContact[];
}

const EmailTuneUpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailData = location.state as EmailData;

  const [selectedModel, setSelectedModel] = useState<string>("");
  const [htmlContent, setHtmlContent] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [contacts, setContacts] = useState<WebhookContact[]>([]);
  const [isFinalizingContinue, setIsFinalizingContinue] = useState(false);
  const [tuningError, setTuningError] = useState<string | null>(null);
  const [availableModels, setAvailableModels] = useState<AIModel[]>([]);
  const [loadingModels, setLoadingModels] = useState(true);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Load email data on component mount
  useEffect(() => {
    if (!emailData) {
      toast.error("No email data found. Redirecting...");
      navigate("/client-lists");
      return;
    }

    setHtmlContent(emailData.html);
    setCandidateName(emailData.candidateName);
    setContacts(emailData.contacts || []);
    setTuningError(null);
  }, [emailData, navigate]);

  // Fetch available models
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const models = await getAvailableModels();
        setAvailableModels(models);
        if (models.length > 0 && !selectedModel) {
          setSelectedModel(models[0].value);
        }
      } catch (error) {
        console.error("Error fetching models:", error);
        toast.error("Failed to load AI models");
      } finally {
        setLoadingModels(false);
      }
    };

    fetchModels();
  }, [selectedModel]);

  const handleChatMessage = async (instruction: string) => {
    if (!htmlContent || !selectedModel) {
      throw new Error("Missing HTML content or AI model");
    }

    setTuningError(null);
    setIsChatLoading(true);

    try {
      console.log(`Processing chat instruction: ${instruction}`);
      const modifiedHTML = await tuneHTMLEmail({
        model: selectedModel,
        htmlContent,
        instruction
      });

      setHtmlContent(modifiedHTML);
      toast.success("Email updated successfully!");
    } catch (error: any) {
      console.error("Chat tuning error:", error);
      setTuningError(error.message || "Failed to process instruction");
      toast.error(`Failed to update email: ${error.message}`);
      throw error;
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleModelChange = (value: string) => {
    console.log(`Model changed to: ${value}`);
    setSelectedModel(value);
  };

  const handleFinalizeAndContinue = async () => {
    if (!htmlContent) {
      toast.error("Email content is missing");
      return;
    }

    if (contacts.length === 0) {
      toast.error("Contact list is missing. Please go back and select contacts.");
      return;
    }

    setIsFinalizingContinue(true);
    
    try {
      console.log("Sending finalized email webhook...");
      await sendFinalizedEmailWebhook({
        emailSubject: "Candidate Introduction", // Extract from HTML if needed
        emailBody: htmlContent,
        clientList: contacts
      });
      
      toast.success("Email finalized and sent successfully!");
      navigate('/candidate/submit');
    } catch (error: any) {
      console.error("Email finalization error:", error);
      toast.error(
        <div className="flex flex-col gap-2">
          <div>Failed to finalize email</div>
          <div className="text-sm text-muted-foreground">{error.message}</div>
          <div className="text-sm">You can still continue to the next step.</div>
        </div>
      );
      
      // Allow user to continue even if finalization fails
      setTimeout(() => {
        navigate('/candidate/submit');
      }, 3000);
    } finally {
      setIsFinalizingContinue(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!emailData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-primary">Email Polish & Preview</h1>
              <p className="text-muted-foreground">
                Review and refine your introduction email for {candidateName}
                {contacts.length > 0 && (
                  <span className="ml-2 text-sm bg-muted px-2 py-1 rounded">
                    {contacts.length} contacts selected
                  </span>
                )}
              </p>
            </div>
          </div>

          {tuningError && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{tuningError}</AlertDescription>
            </Alert>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Email Preview and Chat - Takes up 2/3 of the space */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="preview" className="h-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preview" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="chat" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    AI Polish
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="preview" className="mt-4">
                  <EmailPreview htmlContent={htmlContent} />
                </TabsContent>
                
                <TabsContent value="chat" className="mt-4">
                  <ChatInterface
                    onSendMessage={handleChatMessage}
                    isLoading={isChatLoading}
                    className="h-[600px]"
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Controls & Actions - Takes up 1/3 of the space */}
            <div className="space-y-6">
              {/* AI Model Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">AI Model</label>
                    <SearchableSelect
                      value={selectedModel}
                      onValueChange={handleModelChange}
                      placeholder={loadingModels ? "Loading models..." : "Select model"}
                      disabled={loadingModels}
                      options={availableModels.map((model) => ({
                        value: model.value,
                        label: model.label,
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={handleFinalizeAndContinue}
                    disabled={isFinalizingContinue || !htmlContent}
                    className="w-full"
                    size="lg"
                  >
                    {isFinalizingContinue ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Finalizing...
                      </>
                    ) : (
                      "Finalize & Continue"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmailTuneUpPage;

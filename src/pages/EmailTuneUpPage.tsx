import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Copy, Check, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import { getAvailableModels, tuneEmail, AIModel } from "@/services/emailTuningService";
import { sendFinalizedEmailWebhook, WebhookContact } from "@/services/webhookService";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../components/ui/quill-styles.css';

interface EmailData {
  emailSubject: string;
  emailBody: string;
  candidateName: string;
  clientList?: WebhookContact[];
}

const EmailTuneUpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailData = location.state as EmailData;

  const [selectedModel, setSelectedModel] = useState<string>("");
  const [emailBody, setEmailBody] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [clientList, setClientList] = useState<WebhookContact[]>([]);
  const [isTuning, setIsTuning] = useState(false);
  const [isFinalizingContinue, setIsFinalizingContinue] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tuningError, setTuningError] = useState<string | null>(null);
  const [availableModels, setAvailableModels] = useState<AIModel[]>([]);
  const [loadingModels, setLoadingModels] = useState(true);

  // Rich text editor modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['clean']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'list', 'bullet'
  ];

  // Load email data and models on component mount
  useEffect(() => {
    if (!emailData) {
      toast.error("No email data found. Redirecting...");
      navigate("/client-lists");
      return;
    }

    setEmailSubject(emailData.emailSubject);
    setEmailBody(emailData.emailBody);
    setCandidateName(emailData.candidateName);
    setClientList(emailData.clientList || []);
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
      toast.success("Email polished successfully with Nikola's style!");
    } catch (error: any) {
      console.error("Tuning error:", error);
      setTuningError(error.message || "Failed to tune email");
      toast.error(`Failed to tune email: ${error.message}`);
    } finally {
      setIsTuning(false);
    }
  };

  const handleCopyEmail = async () => {
    try {
      // Try to copy as HTML first, fallback to plain text
      if (navigator.clipboard && window.ClipboardItem) {
        const blob = new Blob([emailBody], { type: 'text/html' });
        const clipboardItem = new ClipboardItem({ 'text/html': blob });
        await navigator.clipboard.write([clipboardItem]);
      } else {
        // Fallback: copy as plain text (strip HTML)
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = emailBody;
        const plainText = tempDiv.textContent || tempDiv.innerText || emailBody;
        await navigator.clipboard.writeText(plainText);
      }
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Email copied to clipboard");
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("Failed to copy email");
    }
  };

  const handleModelChange = (value: string) => {
    console.log(`Model changed to: ${value}`);
    setSelectedModel(value);
  };

  const handleFinalizeAndContinue = async () => {
    if (!emailBody || !emailSubject) {
      toast.error("Email content is missing");
      return;
    }

    if (clientList.length === 0) {
      toast.error("Client list is missing. Please go back and select clients.");
      return;
    }

    setIsFinalizingContinue(true);
    
    try {
      console.log("Sending finalized email webhook...");
      await sendFinalizedEmailWebhook({
        emailSubject,
        emailBody,
        clientList
      });
      
      toast.success("Email finalized and sent successfully!");
      navigate('/candidate/submit');
    } catch (error: any) {
      console.error("Finalized email webhook error:", error);
      toast.error(
        <div className="flex flex-col gap-2">
          <div>Failed to send finalized email</div>
          <div className="text-sm text-muted-foreground">{error.message}</div>
          <div className="text-sm">You can still continue to the next step.</div>
        </div>
      );
      
      // Allow user to continue even if webhook fails
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
              <h1 className="text-3xl font-bold text-primary">Email Tune-Up</h1>
              <p className="text-muted-foreground">
                Polish your introduction email for {candidateName}
                {clientList.length > 0 && (
                  <span className="ml-2 text-sm bg-muted px-2 py-1 rounded">
                    {clientList.length} clients selected
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Email Editor - Takes up 2/3 of the space on large screens */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl">{emailSubject}</CardTitle>
                </CardHeader>
                <CardContent>
                  {tuningError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertTitle>Error tuning email</AlertTitle>
                      <AlertDescription>{tuningError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-4">
                    <ReactQuill
                      theme="snow"
                      value={emailBody}
                      onChange={setEmailBody}
                      modules={modules}
                      formats={formats}
                      className="min-h-[400px]"
                      placeholder="Email content will appear here..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Controls & Actions - Takes up 1/3 of the space */}
            <div className="space-y-6">
              {/* AI Model Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Assistant</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">AI Model</label>
                    <Select value={selectedModel} onValueChange={handleModelChange} disabled={loadingModels}>
                      <SelectTrigger>
                        <SelectValue placeholder={loadingModels ? "Loading models..." : "Select model"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableModels.map((model) => (
                          <SelectItem key={model.value} value={model.value}>
                            {model.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={handleTuneEmail} 
                    disabled={isTuning || !emailBody || !selectedModel}
                    className="w-full"
                  >
                    {isTuning ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Polishing...
                      </>
                    ) : (
                      "✨ Tune Up with Nikola's Style"
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    onClick={handleCopyEmail} 
                    disabled={!emailBody}
                    className="w-full"
                  >
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? "Copied!" : "Copy Email"}
                  </Button>
                  
                  <Button 
                    onClick={handleFinalizeAndContinue}
                    disabled={isFinalizingContinue || !emailBody}
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

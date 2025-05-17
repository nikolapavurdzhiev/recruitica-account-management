
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { generateAIResponse, AI_MODELS, AIMessage } from "@/lib/ai-client";
import CandidateIntroPreview from "@/components/CandidateIntroPreview";
import { Loader2, Copy, FileCode, Eye } from "lucide-react";

// HTML template as a constant
const EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Candidate Introduction</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Optional: Add some basic custom styles if needed */
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            background-color: #f4f7f6; /* Light background for email body */
            margin: 0;
            padding: 20px;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        .email-container {
            max-width: 600px; /* Max width for email content */
            margin: 0 auto; /* Center the container */
            background-color: #ffffff; /* White background for the content area */
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .logo-container {
            text-align: center; /* Center the logo */
            margin-bottom: 20px; /* Space below the logo */
        }
        .logo-container img {
            max-width: 150px; /* Limit logo width for email */
            height: auto; /* Maintain aspect ratio */
        }
        h2 {
            color: #333;
            margin-bottom: 15px;
        }
        p {
            margin-bottom: 10px;
            color: #555;
        }
        .info-section {
            margin-bottom: 20px;
            padding: 15px;
            background-color: #f9f9f9; /* Slightly different background for sections */
            border-radius: 5px;
        }
        .info-section h3 {
            color: #007bff; /* Highlight section titles */
            margin-top: 0;
            margin-bottom: 10px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
        }
        .info-item {
            margin-bottom: 8px;
        }
        .info-item strong {
            color: #333;
            display: inline-block;
            width: 120px; /* Fixed width for labels */
            margin-right: 10px;
        }
        .info-item span {
            color: #555;
        }
        .linkedin-link {
            display: inline-block;
            margin-top: 10px;
            color: #007bff;
            text-decoration: none;
        }
        .linkedin-link:hover {
            text-decoration: underline;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            color: #888;
            font-size: 0.9em;
        }
    </style>
</head>
<body>

    <div class="email-container">
        <div class="logo-container">
            <img src="https://i.ibb.co/WN97sCZt/780x184.png" alt="{{your_company_name}} Logo">
        </div>

        <p>Hi {{client_name}},</p>
        <p>I hope you're doing well.</p>

        <p>I have a really strong candidate, <strong>{{candidate_name}}</strong>, who is interested in speaking with {{your_company_name}}.</p>
        <p>Please take a look at their profile and CV and let me know if you are interested in speaking with them for a potential role at your company.</p>

        <p><strong>LinkedIn Profile:</strong> <a href="{{linkedin_url}}" class="linkedin-link">{{linkedin_url}}</a></p>

        <div class="info-section">
            <h3>Key Details</h3>
            <div class="info-item">
                <strong>Profile Type:</strong> <span>{{profile_type}}</span>
            </div>
            <div class="info-item">
                <strong>Location:</strong> <span>{{location}}</span>
            </div>
            <div class="info-item">
                <strong>Experience:</strong> <span>{{experience}}</span>
            </div>
            <div class="info-item">
                <strong>Desk Type:</strong> <span>{{desk_type}}</span>
            </div>
            <div class="info-item">
                <strong>Languages:</strong> <span>{{languages}}</span>
            </div>
            <div class="info-item">
                <strong>Salary Expectation:</strong> <span>{{salary_expectation}}</span>
            </div>
             <div class="info-item">
                <strong>Notice Period:</strong> <span>{{notice_period}}</span>
            </div>
        </div>

        {{#if billings}}
        <div class="info-section">
            <h3>Billings</h3>
             <div class="info-item">
                <strong>Current Monthly Book:</strong> <span>{{billings.current_monthly_book}}</span>
            </div>
             <div class="info-item">
                <strong>Financial Year:</strong> <span>{{billings.financial_year}}</span>
            </div>
             <div class="info-item">
                <strong>Target:</strong> <span>{{billings.target}}</span>
            </div>
             <div class="info-item">
                <strong>Forecast:</strong> <span>{{billings.forecast}}</span>
            </div>
        </div>
        {{/if}}


        {{#if verticals}}
        <div class="info-section">
            <h3>Verticals</h3>
            <p>{{verticals}}</p>
        </div>
        {{/if}}

        {{#if roles}}
        <div class="info-section">
            <h3>Roles</h3>
            <p>{{roles}}</p>
        </div>
        {{/if}}


        {{#if industries}}
        <div class="info-section">
            <h3>Industries</h3>
            <p>{{industries}}</p>
        </div>
         {{/if}}

        {{#if markets}}
        <div class="info-section">
            <h3>Markets</h3>
            <p>{{markets}}</p>
        </div>
        {{/if}}

        {{#if most_important_things}}
        <div class="info-section">
            <h3>Most Important Things</h3>
            <p>{{most_important_things}}</p>
        </div>
        {{/if}}


        {{#if reason_for_leaving}}
        <div class="info-section">
            <h3>Reason for Leaving</h3>
            <p>{{reason_for_leaving}}</p>
        </div>
         {{/if}}

        {{#if existing_clients}}
        <div class="info-section">
            <h3>Existing Clients</h3>
            <p>{{existing_clients}}</p>
        </div>
        {{/if}}


        <p>Thanks a lot for your time and consideration. Looking forward to hearing from you.</p>
        <p>Best regards,</p>
        <p>{{your_name}}</p>

        <div class="footer">
            <p>This email was sent by Recruitica.</p>
        </div>
    </div>

</body>
</html>`;

// Define the types for the candidate data
type Candidate = {
  id: string;
  candidate_name: string;
  keynotes_url: string | null;
  client_list: string;
};

type CandidateKeynotes = {
  profile_type?: string;
  location?: string;
  experience?: string;
  desk_type?: string;
  languages?: string;
  salary_expectation?: string;
  notice_period?: string;
  verticals?: string;
  roles?: string;
  industries?: string;
  markets?: string;
  most_important_things?: string;
  reason_for_leaving?: string;
  existing_clients?: string;
  linkedin_url?: string;
  billings?: {
    current_monthly_book?: string;
    financial_year?: string;
    target?: string;
    forecast?: string;
  };
};

// Form data for missing fields
type FormData = {
  client_name: string;
  your_company_name: string;
  your_name: string;
};

const CandidateIntroPage: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [keynotes, setKeynotes] = useState<CandidateKeynotes | null>(null);
  const [isLoadingCandidate, setIsLoadingCandidate] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>(AI_MODELS.GPT_4);
  const [generatedHtml, setGeneratedHtml] = useState<string>("");
  const [editedHtml, setEditedHtml] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"preview" | "html">("preview");
  const [formData, setFormData] = useState<FormData>({
    client_name: "",
    your_company_name: "Recruitica",
    your_name: "",
  });

  // Load candidates on page load
  useEffect(() => {
    fetchCandidates();
  }, []);

  // If candidateId is provided in URL, load that candidate
  useEffect(() => {
    if (candidateId) {
      setSelectedCandidateId(candidateId);
      fetchCandidateData(candidateId);
    }
  }, [candidateId]);

  // When selectedCandidateId changes, fetch candidate data
  useEffect(() => {
    if (selectedCandidateId && selectedCandidateId !== candidateId) {
      fetchCandidateData(selectedCandidateId);
    }
  }, [selectedCandidateId]);

  // Fetch all candidates
  const fetchCandidates = async () => {
    try {
      const { data, error } = await supabase
        .from("candidates")
        .select("id, candidate_name, keynotes_url, client_list");

      if (error) throw error;
      setCandidates(data || []);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Failed to load candidates");
    }
  };

  // Fetch candidate data by ID
  const fetchCandidateData = async (id: string) => {
    setIsLoadingCandidate(true);
    try {
      // Fetch candidate record
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setCandidate(data);

      // If candidate has keynotes_url, fetch the keynotes
      if (data?.keynotes_url) {
        await fetchCandidateKeynotes(data.keynotes_url);
      } else {
        setKeynotes(null);
        toast.warning("This candidate doesn't have keynotes data");
      }
    } catch (error) {
      console.error("Error fetching candidate:", error);
      toast.error("Failed to load candidate data");
    } finally {
      setIsLoadingCandidate(false);
    }
  };

  // Fetch keynotes from URL
  const fetchCandidateKeynotes = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch keynotes");
      
      const keynotesData = await response.json();
      setKeynotes(keynotesData);
    } catch (error) {
      console.error("Error fetching keynotes:", error);
      toast.error("Failed to load candidate keynotes");
      setKeynotes(null);
    }
  };

  // Generate intro email with AI
  const generateIntroEmail = async () => {
    if (!candidate || !keynotes) {
      toast.error("Please select a candidate with keynotes data");
      return;
    }

    setIsGenerating(true);
    try {
      // Prepare the data to fill in the template
      const templateData = {
        ...keynotes,
        candidate_name: candidate.candidate_name,
        ...formData
      };

      // Create the prompt for the AI
      const messages: AIMessage[] = [
        {
          role: "system",
          content: 
`You are an AI assistant specialized in creating recruitment emails. 
Your task is to fill in a recruitment email template with the provided candidate data. 
You MUST maintain the exact structure of the HTML template and only replace the variables in double curly braces {{variable_name}} with the corresponding values from the provided data.
Only include conditional sections (those wrapped in {{#if variable}}...{{/if}}) if the corresponding data is provided.
Make the email professional, clear, and engaging.`
        },
        {
          role: "user",
          content: `
I need to fill in the following HTML template with this candidate data:
${JSON.stringify(templateData, null, 2)}

Here's the template with placeholders (denoted by {{placeholder_name}}):

${EMAIL_TEMPLATE}

Please replace all the placeholders with the appropriate values from the candidate data. If data for a placeholder is not available, use a sensible default or remove that section if it's wrapped in a conditional.
Only return the complete filled HTML, no explanations or other text.`
        }
      ];

      // Call the OpenRouter API through our edge function
      const response = await generateAIResponse({
        model: selectedModel,
        messages,
        temperature: 0.3, // Lower temperature for more deterministic results
        max_tokens: 4000, // Ensure enough tokens for the full email
      });

      // Extract the generated HTML from the response
      const generatedContent = response.choices[0].message.content;
      setGeneratedHtml(generatedContent);
      setEditedHtml(generatedContent); // Initialize edited HTML with the generated content
      setActiveTab("preview"); // Switch to preview tab
      
      toast.success("Email template successfully generated");
    } catch (error) {
      console.error("Error generating intro email:", error);
      toast.error("Failed to generate intro email");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(activeTab === "preview" ? generatedHtml : editedHtml)
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Failed to copy to clipboard"));
  };

  // Handle form data change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto p-4 md:p-6 max-w-7xl">
        <h1 className="text-3xl font-bold mb-6">Candidate Introduction Generator</h1>
        
        {/* Candidate Selection and Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="candidate" className="block text-sm font-medium mb-1">
                Select Candidate
              </label>
              <Select 
                value={selectedCandidateId || ""} 
                onValueChange={(value) => setSelectedCandidateId(value)}
              >
                <SelectTrigger className="w-full" disabled={isLoadingCandidate}>
                  <SelectValue placeholder="Select a candidate" />
                </SelectTrigger>
                <SelectContent>
                  {candidates.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.candidate_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="model" className="block text-sm font-medium mb-1">
                AI Model
              </label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select AI model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={AI_MODELS.GPT_4}>GPT-4</SelectItem>
                  <SelectItem value={AI_MODELS.GPT_4_TURBO}>GPT-4 Turbo</SelectItem>
                  <SelectItem value={AI_MODELS.CLAUDE_3_OPUS}>Claude 3 Opus</SelectItem>
                  <SelectItem value={AI_MODELS.CLAUDE_3_SONNET}>Claude 3 Sonnet</SelectItem>
                  <SelectItem value={AI_MODELS.CLAUDE_3_HAIKU}>Claude 3 Haiku</SelectItem>
                  <SelectItem value={AI_MODELS.LLAMA_3_70B}>Llama 3 (70B)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="clientName" className="block text-sm font-medium mb-1">
                Client Name
              </label>
              <input 
                type="text"
                id="clientName"
                name="client_name"
                value={formData.client_name}
                onChange={handleFormChange}
                className="w-full rounded-md border border-input p-2"
                placeholder="Enter client name"
              />
            </div>

            <div>
              <label htmlFor="yourCompanyName" className="block text-sm font-medium mb-1">
                Your Company Name
              </label>
              <input 
                type="text"
                id="yourCompanyName"
                name="your_company_name"
                value={formData.your_company_name}
                onChange={handleFormChange}
                className="w-full rounded-md border border-input p-2"
                placeholder="Enter your company name"
              />
            </div>

            <div>
              <label htmlFor="yourName" className="block text-sm font-medium mb-1">
                Your Name
              </label>
              <input 
                type="text"
                id="yourName"
                name="your_name"
                value={formData.your_name}
                onChange={handleFormChange}
                className="w-full rounded-md border border-input p-2"
                placeholder="Enter your name"
              />
            </div>

            <Button
              onClick={generateIntroEmail}
              disabled={isGenerating || isLoadingCandidate || !selectedCandidateId}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Introduction Email"
              )}
            </Button>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Candidate Data</h2>
            {isLoadingCandidate ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : candidate ? (
              <div className="border rounded-lg p-4 h-[300px] overflow-y-auto">
                <h3 className="font-bold text-lg mb-2">{candidate.candidate_name}</h3>
                {keynotes ? (
                  <div className="space-y-2 text-sm">
                    {Object.entries(keynotes).map(([key, value]) => {
                      // Handle nested objects like billings
                      if (typeof value === 'object' && value !== null) {
                        return (
                          <div key={key} className="border-t pt-2">
                            <strong className="capitalize">{key}:</strong>
                            <div className="pl-4">
                              {Object.entries(value).map(([subKey, subValue]) => (
                                <div key={subKey}>
                                  <em className="capitalize">{subKey.replace(/_/g, ' ')}:</em> {String(subValue)}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div key={key} className="border-t pt-2">
                          <strong className="capitalize">{key.replace(/_/g, ' ')}:</strong> {String(value)}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">No keynotes data available</p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground italic">Select a candidate to view their data</p>
            )}
          </div>
        </div>

        {/* Preview/Edit Tabs */}
        {generatedHtml && (
          <div className="border rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b bg-muted/50">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "preview" | "html")}>
                <TabsList>
                  <TabsTrigger value="preview" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="html" className="flex items-center gap-2">
                    <FileCode className="h-4 w-4" />
                    HTML
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>

            <TabsContent value="preview" className="m-0">
              <div className="p-4">
                <CandidateIntroPreview html={activeTab === "preview" ? generatedHtml : editedHtml} />
              </div>
            </TabsContent>

            <TabsContent value="html" className="m-0">
              <div className="p-4">
                <Textarea
                  value={editedHtml}
                  onChange={(e) => setEditedHtml(e.target.value)}
                  className="font-mono text-sm min-h-[500px]"
                />
              </div>
            </TabsContent>
          </div>
        )}
      </main>
    </div>
  );
};

export default CandidateIntroPage;

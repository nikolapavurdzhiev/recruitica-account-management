
import { supabase } from "@/integrations/supabase/client";

export interface TuningOptions {
  model: string;
  emailBody: string;
}

export interface TuningResponse {
  refinedEmail: string;
}

export const AI_MODELS = [
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini" },
  { value: "claude-3-opus-20240229", label: "Claude 3 Opus" },
  { value: "claude-3-sonnet-20240229", label: "Claude 3 Sonnet" },
  { value: "claude-3-haiku-20240307", label: "Claude 3 Haiku" },
  { value: "meta-llama/llama-3-70b-instruct", label: "Llama 3 70B" },
  { value: "mistral-large-latest", label: "Mistral Large" },
  { value: "mistral-medium", label: "Mistral Medium" },
];

export const tuneEmail = async ({ model, emailBody }: TuningOptions): Promise<string> => {
  console.log(`Starting email tuning with model: ${model}`);
  
  if (!emailBody) {
    console.error("Empty email body provided");
    throw new Error("Email body is required for tuning");
  }

  try {
    console.log("Calling ai-generate edge function with params:", { model, emailBody });
    
    const { data, error } = await supabase.functions.invoke("ai-generate", {
      body: {
        model,
        messages: [
          {
            role: "system",
            content: "You're Nikola's assistant helping polish introduction emails to clients. Refine this email by enhancing clarity and professionalism, without changing facts or tone. Make it concise, warm, and easy to read. Return only the edited version, no explanations."
          },
          {
            role: "user",
            content: emailBody
          }
        ],
        temperature: 0.7
      },
    });

    if (error) {
      console.error("Error tuning email:", error);
      throw new Error(`Email tuning failed: ${error.message}`);
    }

    console.log("Received response from AI:", data);
    
    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Invalid response format from OpenRouter:", data);
      throw new Error("Invalid response from AI service");
    }

    return data.choices[0].message.content;
  } catch (error: any) {
    console.error("Failed to tune email:", error);
    throw error;
  }
};

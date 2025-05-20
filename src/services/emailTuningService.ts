
import { supabase } from "@/integrations/supabase/client";

export interface TuningOptions {
  model: string;
  emailBody: string;
}

export interface TuningResponse {
  refinedEmail: string;
}

export const AI_MODELS = [
  { value: "gpt-4o-mini", label: "GPT-4o Mini" },
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "mistral-large-latest", label: "Mistral Large" },
  { value: "deepseek-coder", label: "DeepSeek Coder" },
];

export const tuneEmail = async ({ model, emailBody }: TuningOptions): Promise<string> => {
  try {
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

    return data.choices[0].message.content;
  } catch (error: any) {
    console.error("Failed to tune email:", error);
    throw error;
  }
};

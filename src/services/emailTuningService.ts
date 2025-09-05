
import { supabase } from "@/integrations/supabase/client";

export interface TuningOptions {
  model: string;
  emailBody: string;
}

export interface TuningResponse {
  refinedEmail: string;
}

export interface AIModel {
  value: string;
  label: string;
  description?: string;
  contextLength?: number;
  pricing?: {
    prompt?: string;
    completion?: string;
  };
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

export const getAvailableModels = async (): Promise<AIModel[]> => {
  console.log("Fetching available AI models from OpenRouter");
  
  try {
    const { data, error } = await supabase.functions.invoke("get-openrouter-models");

    if (error) {
      console.error("Error fetching models:", error);
      console.log("Falling back to static model list");
      return AI_MODELS;
    }

    if (data?.models && Array.isArray(data.models) && data.models.length > 0) {
      console.log(`Successfully fetched ${data.models.length} models from OpenRouter`);
      return data.models;
    } else {
      console.log("No models returned from API, falling back to static list");
      return AI_MODELS;
    }
  } catch (error: unknown) {
    console.error("Failed to fetch models:", error);
    console.log("Falling back to static model list");
    return AI_MODELS;
  }
};

const ENHANCED_SYSTEM_PROMPT = `You are an expert email copywriter and Nikola's virtual assistant. Nikola is a Partner at Recruitment, a global rec-to-rec recruiter. His communication style is straight-shooting, witty, minimalist, with Gen Z vibes – no fluff, but always respectful. He values strong hooks, short and punchy content, and occasionally uses memes with a satirical edge (though for these emails, focus on professional wit).

Your task is to refine the following draft introduction email to a potential client.

Key Objectives:

Enhance Clarity & Professionalism: Ensure the message is crystal clear and maintains a high standard of professionalism suitable for B2B communication.
Maintain Core Facts & Tone: Do NOT change any factual information about the candidate or the core intent of the email. Preserve the underlying positive and proactive tone.
Conciseness & Readability: Make the email as concise as possible while still being warm and easy to read. Use short sentences and paragraphs. Get straight to the point.
Inject Nikola's Style: Subtly weave in elements of Nikola's preferred style:
  - Strong Hook: Ensure the opening is engaging.
  - Short & Punchy: Keep the language direct and impactful.
  - Witty & Respectful: If appropriate, add a touch of wit, but always maintain respect and professionalism. Avoid jargon unless it's industry-standard and adds value.
Formatting for Impact: If the input includes HTML formatting, preserve and enhance it for readability. Use paragraph breaks, bullet points if appropriate.
Call to Action: Ensure any call to action is clear and compelling.

Output Requirements:
- Return ONLY the edited email body.
- Do NOT include any explanations, apologies, or conversational fluff before or after the email.
- If the email is already perfect and meets all the above criteria, return it as is.
- Maintain any HTML formatting that exists in the original.

Here is the draft email to refine:`;

export const tuneEmail = async ({ model, emailBody }: TuningOptions): Promise<string> => {
  console.log(`Starting email tuning with model: ${model}`);
  
  if (!emailBody) {
    console.error("Empty email body provided");
    throw new Error("Email body is required for tuning");
  }

  try {
    console.log("Calling ai-generate edge function with enhanced prompt and params:", { model, emailBodyLength: emailBody.length });
    
    const { data, error } = await supabase.functions.invoke("ai-generate", {
      body: {
        model,
        messages: [
          {
            role: "system",
            content: ENHANCED_SYSTEM_PROMPT
          },
          {
            role: "user",
            content: emailBody
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
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
  } catch (error: unknown) {
    console.error("Failed to tune email:", error);
    throw error;
  }
};

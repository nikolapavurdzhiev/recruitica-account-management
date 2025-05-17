
import { supabase } from "@/integrations/supabase/client";

export type AIMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AIGenerateParams = {
  model: string;
  messages: AIMessage[];
  temperature?: number;
  max_tokens?: number;
};

export type AIGenerateResponse = {
  id: string;
  choices: {
    index: number;
    message: AIMessage;
    finish_reason: string;
  }[];
  created: number;
  model: string;
  object: string;
};

/**
 * Generate text using AI models via OpenRouter
 * @param params - Parameters for the AI generation
 * @returns Generated AI response
 */
export const generateAIResponse = async (
  params: AIGenerateParams
): Promise<AIGenerateResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke("ai-generate", {
      body: params,
    });

    if (error) {
      console.error("Error calling AI generate function:", error);
      throw new Error(`AI generate function error: ${error.message}`);
    }

    return data as AIGenerateResponse;
  } catch (error) {
    console.error("Failed to generate AI response:", error);
    throw error;
  }
};

/**
 * Available OpenRouter models
 * This can be expanded based on OpenRouter's supported models
 */
export const AI_MODELS = {
  GPT_4: "gpt-4",
  GPT_4_TURBO: "gpt-4-turbo",
  GPT_3_5_TURBO: "gpt-3.5-turbo",
  CLAUDE_3_OPUS: "claude-3-opus-20240229",
  CLAUDE_3_SONNET: "claude-3-sonnet-20240229",
  CLAUDE_3_HAIKU: "claude-3-haiku-20240307",
  LLAMA_3_70B: "meta-llama/llama-3-70b-instruct",
  LLAMA_3_8B: "meta-llama/llama-3-8b-instruct",
};


import { supabase } from "@/integrations/supabase/client";

export interface HTMLEmailTuningRequest {
  model: string;
  htmlContent: string;
  instruction: string;
}

export const tuneHTMLEmail = async ({ model, htmlContent, instruction }: HTMLEmailTuningRequest): Promise<string> => {
  console.log(`Tuning HTML email with model: ${model}`);
  console.log(`Instruction: ${instruction}`);
  console.log(`HTML length: ${htmlContent.length} characters`);

  try {
    const { data, error } = await supabase.functions.invoke('ai-generate', {
      body: {
        model,
        messages: [
          {
            role: 'system',
            content: `You are an expert email editor specializing in HTML email formatting and content refinement. You will receive an HTML email and instructions for modifications.

IMPORTANT RULES:
1. ALWAYS return valid, complete HTML that can be displayed in an email client
2. Preserve the overall email structure and styling
3. Keep all CSS styles intact unless specifically asked to modify them
4. Maintain email-safe HTML practices (inline styles, table layouts, etc.)
5. Apply the user's requested changes precisely
6. If you need to make text bold, use <strong> tags
7. If you need to modify styling, use inline styles
8. Keep the professional tone and branding consistent
9. Ensure the email remains mobile-responsive

Your response should ONLY contain the modified HTML email - no explanations or additional text.`
          },
          {
            role: 'user',
            content: `Here is the current HTML email:

${htmlContent}

Please apply this instruction: ${instruction}

Return the complete modified HTML email.`
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(`AI request failed: ${error.message}`);
    }

    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid AI response structure:', data);
      throw new Error('Invalid response from AI service');
    }

    const tunedHTML = data.choices[0].message.content.trim();
    
    if (!tunedHTML) {
      throw new Error('AI returned empty response');
    }

    console.log('HTML email tuning successful');
    return tunedHTML;

  } catch (error: any) {
    console.error('Error tuning HTML email:', error);
    throw new Error(error.message || 'Failed to tune HTML email');
  }
};

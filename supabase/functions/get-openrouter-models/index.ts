
// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
// @ts-expect-error - Deno runtime module, not available in Node.js TypeScript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Type declarations for Deno runtime
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    // Get the OpenRouter API key from environment
    const apiKey = Deno.env.get('OPENROUTER_API_KEY')
    if (!apiKey) {
      throw new Error('OpenRouter API key not configured')
    }

    console.log('Fetching available models from OpenRouter')
    
    // Make the request to OpenRouter API to get models
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': Deno.env.get('APP_URL') || 'https://recruitment.app',
        'Content-Type': 'application/json',
        'X-Title': 'Recruitment App'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenRouter API error:', errorText)
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`Fetched ${data.data?.length || 0} models from OpenRouter`)
    
    // Filter and format models for text generation (exclude image/embedding models)
    const textModels = data.data
      ?.filter((model: Record<string, unknown>) => 
        model.id && 
        model.name && 
        !String(model.id).includes('embedding') &&
        !String(model.id).includes('whisper') &&
        !String(model.id).includes('dall-e') &&
        !String(model.id).includes('tts') &&
        Number(model.context_length) > 1000 // Ensure reasonable context length
      )
      ?.map((model: Record<string, unknown>) => ({
        value: String(model.id),
        label: String(model.name),
        description: String(model.description || ''),
        contextLength: Number(model.context_length),
        pricing: model.pricing as { prompt?: string; completion?: string }
      }))
      ?.sort((a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label)) || []

    console.log(`Returning ${textModels.length} filtered text generation models`)
    
    return new Response(JSON.stringify({ models: textModels }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: unknown) {
    console.error('Error in get-openrouter-models function:', error)
    
    // Return error response
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new Response(
      JSON.stringify({
        error: errorMessage,
        models: [] // Fallback to empty array
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

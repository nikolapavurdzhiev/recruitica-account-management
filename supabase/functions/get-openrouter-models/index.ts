
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
      ?.filter((model: any) => 
        model.id && 
        model.name && 
        !model.id.includes('embedding') &&
        !model.id.includes('whisper') &&
        !model.id.includes('dall-e') &&
        !model.id.includes('tts') &&
        model.context_length > 1000 // Ensure reasonable context length
      )
      ?.map((model: any) => ({
        value: model.id,
        label: model.name,
        description: model.description || '',
        contextLength: model.context_length,
        pricing: model.pricing
      }))
      ?.sort((a: any, b: any) => a.label.localeCompare(b.label)) || []

    console.log(`Returning ${textModels.length} filtered text generation models`)
    
    return new Response(JSON.stringify({ models: textModels }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Error in get-openrouter-models function:', error)
    
    // Return error response
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
        models: [] // Fallback to empty array
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

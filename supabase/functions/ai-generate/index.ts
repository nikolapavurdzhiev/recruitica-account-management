
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

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

    // Parse the request body
    const requestData = await req.json()
    const { model, messages, temperature = 0.7, max_tokens = 500 } = requestData

    // Validate required fields
    if (!model) throw new Error('Missing required parameter: model')
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error('Missing or invalid parameter: messages')
    }

    console.log(`Making request to OpenRouter with model: ${model}`)
    console.log(`System message: ${messages[0]?.content?.substring(0, 50)}...`)
    
    // Prepare the request to OpenRouter
    const openRouterRequestBody = {
      model,
      messages,
      temperature,
      max_tokens
    }

    // Make the request to OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': Deno.env.get('APP_URL') || 'https://recruitica.app',
        'Content-Type': 'application/json',
        'X-Title': 'Recruitica App'
      },
      body: JSON.stringify(openRouterRequestBody),
    })

    // Handle response
    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenRouter API error:', errorText)
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('OpenRouter response received successfully')
    
    // Return the OpenRouter response
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in AI generate function:', error)
    
    // Return error response
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

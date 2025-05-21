
export interface WebhookContact {
  name: string;
  email: string;
  company: string;
}

export interface WebhookData {
  candidateName: string;
  keynotesFile: string;
  contacts: WebhookContact[];
}

export interface WebhookResponse {
  emailSubject: string;
  emailBody: string;
  clientList: WebhookContact[];
}

// Internal interface to match the n8n response format
interface N8nWebhookResponse {
  output: WebhookResponse;
}

export const sendWebhook = async (data: WebhookData): Promise<WebhookResponse> => {
  console.log("Sending webhook data:", data);
  
  // Create an AbortController with a 60-second timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds timeout
  
  try {
    const response = await fetch(
      'https://nikolapavurdjiev.app.n8n.cloud/webhook-test/c1f76bc0-d38a-4b5f-aeae-87578650912b',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data),
        signal: controller.signal
      }
    );

    console.log("Webhook response status:", response.status);
    
    if (!response.ok) {
      throw new Error(`Webhook request failed with status ${response.status}`);
    }
    
    // Parse the response JSON
    const responseData = await response.json();
    console.log("Webhook response data:", responseData);
    
    // Handle n8n's nested response format
    if (Array.isArray(responseData) && responseData.length > 0 && responseData[0].output) {
      console.log("Found n8n nested response format, extracting output data");
      return responseData[0].output as WebhookResponse;
    }
    
    // Fallback for direct response format
    return responseData as WebhookResponse;
  } catch (error: any) {
    // Check if the error is due to timeout
    if (error.name === 'AbortError') {
      throw new Error('Webhook request timed out after 60 seconds. The n8n workflow might still be processing.');
    }
    throw error;
  } finally {
    // Clear the timeout to prevent memory leaks
    clearTimeout(timeoutId);
  }
};


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
    console.log("Response data type:", typeof responseData);
    console.log("Response data structure:", Array.isArray(responseData) ? "array" : "object");
    
    // Primary check: Handle direct object with "output" key
    if (responseData && typeof responseData === 'object' && !Array.isArray(responseData) && responseData.output) {
      console.log("Found direct object format with output key, extracting output data");
      
      // Validate that output contains expected properties
      const outputData = responseData.output;
      if (outputData && typeof outputData === 'object') {
        console.log("Successfully extracted output data from direct object format");
        return outputData as WebhookResponse;
      } else {
        throw new Error('Invalid output data structure in direct object format');
      }
    }
    
    // Fallback: Handle n8n's nested array response format
    if (Array.isArray(responseData) && responseData.length > 0 && responseData[0].output) {
      console.log("Found n8n nested array format, extracting output data");
      
      // Validate that output contains expected properties
      const outputData = responseData[0].output;
      if (outputData && typeof outputData === 'object') {
        console.log("Successfully extracted output data from array format");
        return outputData as WebhookResponse;
      } else {
        throw new Error('Invalid output data structure in array format');
      }
    }
    
    // Error handling for unexpected format
    console.error("Unexpected webhook response format. Expected either:");
    console.error("1. Direct object: { output: { emailSubject, emailBody, clientList } }");
    console.error("2. Array format: [{ output: { emailSubject, emailBody, clientList } }]");
    console.error("Received:", responseData);
    
    throw new Error('Unexpected webhook response format. The response does not contain the expected "output" structure.');
    
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

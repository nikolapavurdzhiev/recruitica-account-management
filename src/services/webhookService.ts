
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
  html: string;
  contacts: WebhookContact[];
}

export interface FinalizedEmailWebhookData {
  emailSubject: string;
  emailBody: string;
  clientList: WebhookContact[];
}

// Internal interface to match the new n8n response format
interface N8nWebhookResponse {
  response: {
    body: {
      html: string;
      contacts: WebhookContact[];
    };
    headers: {};
    statusCode: number;
  };
}

export const sendWebhook = async (data: WebhookData): Promise<WebhookResponse> => {
  console.log("Sending webhook data:", data);
  
  // Create an AbortController with a 60-second timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds timeout
  
  try {
    const response = await fetch(
      'https://nikolapavurdjiev.app.n8n.cloud/webhook/c1f76bc0-d38a-4b5f-aeae-87578650912b',
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
    
    // Handle new array format with response.body structure
    if (Array.isArray(responseData) && responseData.length > 0 && responseData[0].response?.body) {
      console.log("Found new n8n array format with response.body, extracting data");
      
      const bodyData = responseData[0].response.body;
      if (bodyData && bodyData.html && bodyData.contacts) {
        console.log("Successfully extracted HTML and contacts from new format");
        return {
          html: bodyData.html,
          contacts: bodyData.contacts
        } as WebhookResponse;
      } else {
        throw new Error('Invalid body data structure in new array format');
      }
    }
    
    // Fallback: Handle direct object format if needed
    if (responseData && typeof responseData === 'object' && !Array.isArray(responseData) && responseData.html) {
      console.log("Found direct object format, extracting data");
      return {
        html: responseData.html,
        contacts: responseData.contacts || []
      } as WebhookResponse;
    }
    
    // Error handling for unexpected format
    console.error("Unexpected webhook response format. Expected:");
    console.error("Array format: [{ response: { body: { html, contacts } } }]");
    console.error("Received:", responseData);
    
    throw new Error('Unexpected webhook response format. The response does not contain the expected HTML structure.');
    
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

export const sendFinalizedEmailWebhook = async (data: FinalizedEmailWebhookData): Promise<void> => {
  console.log("Sending finalized email webhook data:", data);
  
  // Create an AbortController with a 60-second timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds timeout
  
  try {
    const response = await fetch(
      'https://nikolapavurdjiev.app.n8n.cloud/webhook/0490a53a-67ce-4fd9-9418-bd8593cee00c',
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

    console.log("Finalized email webhook response status:", response.status);
    
    if (!response.ok) {
      throw new Error(`Finalized email webhook request failed with status ${response.status}`);
    }
    
    console.log("Finalized email webhook sent successfully");
    
  } catch (error: any) {
    // Check if the error is due to timeout
    if (error.name === 'AbortError') {
      throw new Error('Finalized email webhook request timed out after 60 seconds. The n8n workflow might still be processing.');
    }
    console.error("Finalized email webhook error:", error);
    throw error;
  } finally {
    // Clear the timeout to prevent memory leaks
    clearTimeout(timeoutId);
  }
};

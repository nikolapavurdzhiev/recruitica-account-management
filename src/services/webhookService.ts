
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

export const sendWebhook = async (data: WebhookData): Promise<void> => {
  console.log("Sending webhook data:", data);
  
  const response = await fetch(
    'https://nikolapavurdjiev.app.n8n.cloud/webhook-test/c1f76bc0-d38a-4b5f-aeae-87578650912b',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data),
    }
  );

  console.log("Webhook response status:", response.status);
  
  if (!response.ok) {
    throw new Error(`Webhook request failed with status ${response.status}`);
  }
  
  // Try to parse the response if there is one
  let responseData;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      responseData = await response.json();
      console.log("Webhook response data:", responseData);
    } catch (e) {
      console.log("Could not parse JSON response:", e);
    }
  } else {
    const textResponse = await response.text();
    console.log("Webhook text response:", textResponse);
  }
  
  return;
};

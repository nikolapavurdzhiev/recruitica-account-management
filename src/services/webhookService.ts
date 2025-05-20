
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

export const sendWebhook = async (data: WebhookData): Promise<WebhookResponse> => {
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
  
  // Parse the response JSON
  const responseData = await response.json();
  console.log("Webhook response data:", responseData);
  
  return responseData as WebhookResponse;
};

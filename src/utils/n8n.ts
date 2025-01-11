const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;
//https://talented-absolutely-bream.ngrok-free.app/webhook/ytube
console.log('Environment variables:', import.meta.env); // Debug all env vars

export async function summarizeVideo(youtubeUrl: string): Promise<string> {
  if (!N8N_WEBHOOK_URL) {
    throw new Error('N8N webhook URL is not configured in environment variables');
  }

  console.log('Attempting to call webhook URL:', N8N_WEBHOOK_URL);
  console.log('With YouTube URL:', youtubeUrl);

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ youtubeUrl }),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response data:', data);
    
    if (!data || !data.summary) {
      throw new Error('Invalid response from n8n webhook');
    }

    return data.summary;
  } catch (error) {
    console.error('Error calling n8n webhook:', error);
    throw new Error('Failed to process video. Please check your webhook URL and try again.');
  }
}
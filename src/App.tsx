import React from 'react';
import { useAuthenticationStatus, useSignOut } from '@nhost/react';
import { VideoInput } from './components/VideoInput';
import { Summary } from './components/Summary';
import { Auth } from './components/Auth';
import { Youtube, LogOut } from 'lucide-react';
import { summarizeVideo } from './utils/n8n';

function App() {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const { signOut } = useSignOut();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [summary, setSummary] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (url: string) => {
    setIsProcessing(true);
    setError(null);
    
    if (!import.meta.env.VITE_N8N_WEBHOOK_URL) {
      setError('N8N webhook URL is not configured');
      setIsProcessing(false);
      return;
    }

    try {
      const result = await summarizeVideo(url);
      setSummary(result);
    } catch (error) {
      setError('Failed to generate summary. Please check your webhook URL and try again.');
      console.error('Error processing video:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="absolute top-4 right-4">
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 bg-white rounded-lg shadow hover:shadow-md transition-all"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>

        <div className="flex flex-col items-center text-center mb-12">
          <div className="bg-red-600 p-3 rounded-full mb-4">
            <Youtube className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">YouTube Video Summarizer</h1>
          <p className="text-gray-600 max-w-xl">
            Enter a YouTube video URL below to get an AI-generated summary of its content.
          </p>
        </div>

        <div className="flex flex-col items-center gap-8">
          <VideoInput onSubmit={handleSubmit} isLoading={isProcessing} />
          {error && (
            <div className="text-red-600 bg-red-50 px-4 py-2 rounded-lg">
              {error}
            </div>
          )}
          <Summary summary={summary} />
        </div>
      </div>
    </div>
  );
}

export default App;
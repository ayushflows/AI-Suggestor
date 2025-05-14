'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ChatHistory from './ChatHistory'; // To be created
import ChatInput from './ChatInput';   // To be created

// Define types for chat messages
export interface UserInputAction {
  mode: 'Gaming' | 'Work' | 'Study' | '';
  mood: 'Happy' | 'Stressed' | 'Tired' | 'Energetic' | '';
  timeOfDay: string; // Can be auto-detected (e.g., "Morning") or manual input
  message?: string;
}

export interface ChatMessage {
  id: string; // Unique ID for each message
  isUser: boolean;
  userInput?: UserInputAction; // For user messages
  aiResponse?: string;       // For AI messages
  timestamp: Date;
}

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true); // New state for history loading

  useEffect(() => {
    if (status === 'loading') return; 

    if (!session) {
      router.push('/login?callbackUrl=/chat');
      return; // Important to return after navigation
    }

    // Fetch initial chat history if session exists
    const fetchHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const response = await fetch('/api/chat/history');
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to fetch chat history');
        }
        const historyMessages: ChatMessage[] = await response.json();
        // Timestamps from DB are likely strings, convert them back to Date objects if needed
        // For now, assuming ChatMessage type on client can handle string or has a transformer
        // Or ensure mapDocumentToChatMessage in API sends Date objects (which it should)
        setChatMessages(historyMessages.map(msg => ({...msg, timestamp: new Date(msg.timestamp)})));
      } catch (error) {
        console.error("Error fetching chat history:", error);
        // Optionally set an error message to display to the user
      } finally {
        setIsLoadingHistory(false);
      }
    };

    if (session) {
        fetchHistory();
    }

  }, [session, status, router]);

  const handleNewChatMessage = async (input: UserInputAction) => {
    setIsLoadingResponse(true);
    const userMessageId = Date.now().toString() + '_user';
    const newUserMessage: ChatMessage = {
      id: userMessageId,
      isUser: true,
      userInput: input,
      timestamp: new Date(),
    };
    const updatedMessages = [...chatMessages, newUserMessage];
    setChatMessages(updatedMessages);

    try {
      const response = await fetch('/api/chat/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userInput: input, 
          history: updatedMessages.slice(0, -1).slice(-4) 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to get AI response and couldn't parse error JSON." }));
        console.error("API Error Response:", errorData);
        throw new Error(errorData.message || 'Failed to get AI response');
      }

      const data = await response.json();
      const aiMessageId = Date.now().toString() + '_ai';
      const newAiMessage: ChatMessage = {
        id: aiMessageId,
        isUser: false,
        aiResponse: data.aiResponse,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, newAiMessage]);

    } catch (error) {
      console.error("Error sending message or getting AI response:", error);
      const errorAiMessage: ChatMessage = {
        id: Date.now().toString() + '_error',
        isUser: false,
        aiResponse: error instanceof Error ? error.message : "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorAiMessage]);
    }
    setIsLoadingResponse(false);
  };

  // Updated loading condition to include history loading
  if (status === 'loading' || isLoadingHistory || (status !== 'authenticated' && !session) ) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-950 to-black text-white p-6">
        <p className="text-xl">Loading AIProductiv Chat...</p>
        <svg className="animate-spin h-8 w-8 text-purple-400 mt-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }
  // No explicit !session check here for rendering, as useEffect handles redirection if !session after loading.
  // If we reach here, session should be authenticated or useEffect is about to redirect.

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-950 to-black text-white pt-16 md:pt-20">
      <main className="flex-grow flex flex-col container mx-auto p-4 md:p-6 w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl">
        <ChatHistory messages={chatMessages} isLoadingResponse={isLoadingResponse} />
        <ChatInput onSubmit={handleNewChatMessage} isLoading={isLoadingResponse} />
      </main>
    </div>
  );
} 
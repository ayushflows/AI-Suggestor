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

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (!session) {
      router.push('/login?callbackUrl=/chat'); // Redirect to login if not authenticated
    }
    // TODO: Fetch initial chat history for the user if session exists
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
    setChatMessages(prev => [...prev, newUserMessage]);

    // --- Simulated AI Response --- (Replace with actual API call later)
    // For now, we simulate a delay and a generic response.
    // This section will be replaced by the actual API call to your backend,
    // which then calls OpenAI and saves to MongoDB.
    try {
      // const response = await fetch('/api/chat/submit', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     userInput: input, 
      //     history: chatMessages.slice(-4) // Send last 4 messages for context (example)
      //   }),
      // });
      // if (!response.ok) {
      //   throw new Error('Failed to get AI response');
      // }
      // const data = await response.json();
      // const aiMessageId = Date.now().toString() + '_ai';
      // const newAiMessage: ChatMessage = {
      //   id: aiMessageId,
      //   isUser: false,
      //   aiResponse: data.aiResponse,
      //   timestamp: new Date(),
      // };
      // setChatMessages(prev => [...prev, newAiMessage]);

      // --- START SIMULATION ---
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      const simulatedAiResponse = `AI: Received Mode: ${input.mode}, Mood: ${input.mood}, Time: ${input.timeOfDay}. Message: '${input.message || "(no message)"}'. I'm processing this...`;
      const aiMessageId = Date.now().toString() + '_ai';
      const newAiMessage: ChatMessage = {
        id: aiMessageId,
        isUser: false,
        aiResponse: simulatedAiResponse,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, newAiMessage]);
      // --- END SIMULATION ---

    } catch (error) {
      console.error("Error sending message or getting AI response:", error);
      const errorAiMessage: ChatMessage = {
        id: Date.now().toString() + '_error',
        isUser: false,
        aiResponse: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorAiMessage]);
    }

    setIsLoadingResponse(false);
  };

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-950 to-black text-white p-6">
        <p className="text-xl">Loading session or redirecting...</p>
        {/* Basic spinner */} 
        <svg className="animate-spin h-8 w-8 text-purple-400 mt-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  // If session exists, display the chat page content
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-950 to-black text-white pt-16 md:pt-20"> {/* Adjusted top padding for global navbar */} 
      {/* The global Navbar from layout.tsx will be here. No need for a separate header. */}
      
      <main className="flex-grow flex flex-col container mx-auto p-4 md:p-6 w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl">
        <ChatHistory messages={chatMessages} isLoadingResponse={isLoadingResponse} />
        <ChatInput onSubmit={handleNewChatMessage} isLoading={isLoadingResponse} />
      </main>
    </div>
  );
} 
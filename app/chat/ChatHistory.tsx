'use client';

import React from 'react';
import { ChatMessage, UserInputAction } from './page'; // Import types from chat page
import { Bot, UserCircle2 } from 'lucide-react';

interface ChatHistoryProps {
  messages: ChatMessage[];
  isLoadingResponse: boolean;
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isLoadingResponse }) => {
  // Scroll to bottom functionality can be added here later using a ref

  const renderUserInput = (input: UserInputAction) => (
    <div className="p-3 bg-blue-600/80 rounded-lg rounded-tr-none shadow max-w-lg break-words">
      <p className="font-semibold text-sm mb-1">
        Mode: {input.mode || 'N/A'} | Mood: {input.mood || 'N/A'} | Time: {input.timeOfDay || 'N/A'}
      </p>
      {input.message && <p className="text-white">{input.message}</p>}
    </div>
  );

  const renderAiResponse = (response: string) => (
    <div className="p-3 bg-gray-700/80 rounded-lg rounded-tl-none shadow max-w-lg break-words">
      <p className="text-white">{response}</p>
    </div>
  );

  return (
    <div className="flex-grow bg-gray-800/40 rounded-lg p-4 mb-4 overflow-y-auto border border-gray-700/60 min-h-[300px] max-h-[calc(100vh-250px)] scroll-smooth">
      {messages.length === 0 && !isLoadingResponse && (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <Bot size={48} className="mb-4" />
          <p className="text-lg">No messages yet.</p>
          <p className="text-sm">Start by selecting your mode and mood below.</p>
        </div>
      )}
      <div className="space-y-5 pr-2"> {/* Added pr-2 for scrollbar spacing if needed */}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end space-x-3 ${msg.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
            {msg.isUser ? (
              <UserCircle2 size={40} className="flex-shrink-0 text-blue-400" /> // Or user image if available
            ) : (
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                <Bot size={24} />
              </div>
            )}
            <div className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'}`}>
              {msg.isUser && msg.userInput ? renderUserInput(msg.userInput) : renderAiResponse(msg.aiResponse || '...')}
              <p className={`text-xs text-gray-500 mt-1.5 ${msg.isUser ? 'text-right' : 'text-left'}`}>
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}
        {isLoadingResponse && (
          <div className="flex items-end space-x-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
              <Bot size={24} />
            </div>
            <div className="p-3 bg-gray-700/80 rounded-lg rounded-tl-none shadow max-w-lg">
              <p className="text-white italic animate-pulse">AI is thinking...</p>
            </div>
          </div>
        )}
      </div>
      {/* TODO: Add a ref and effect to scroll to bottom on new messages */}
    </div>
  );
};

export default ChatHistory; 
'use client';

import React, { useEffect, useRef } from 'react';
import { ChatMessage, UserInputAction } from './page'; // Import types from chat page
import { Bot } from 'lucide-react';
import Image from 'next/image'; // Import NextImage
import { Session } from 'next-auth'; // Import Session type for currentUser prop
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown
import remarkGfm from 'remark-gfm';       // Import remarkGfm for GitHub Flavored Markdown

interface ChatHistoryProps {
  messages: ChatMessage[];
  isLoadingResponse: boolean;
  currentUser?: Session['user']; // Add currentUser prop (optional because session might be loading)
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const UserAvatar: React.FC<{ user?: Session['user'] }> = ({ user }) => {
  if (user?.image) {
    return (
      <Image 
        src={user.image} 
        alt={user.name || 'User'} 
        width={40} 
        height={40} 
        className="rounded-full flex-shrink-0"
      />
    );
  }
  const initials = user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U');
  return (
    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
      {initials}
    </div>
  );
};

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isLoadingResponse, currentUser }) => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null); // Ref for scrolling

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom(); // Scroll to bottom whenever messages change
  }, [messages]);

  const renderUserInput = (input: UserInputAction) => (
    <div className="p-3 bg-blue-600/80 rounded-lg rounded-tr-none shadow max-w-lg break-words">
      <p className="font-semibold text-sm mb-1">
        Mode: {input.mode || 'N/A'} | Mood: {input.mood || 'N/A'} | Time: {input.timeOfDay || 'N/A'}
      </p>
      {input.message && <p className="text-white">{input.message}</p>}
    </div>
  );

  const renderAiResponse = (response: string) => (
    <div className="prose prose-sm prose-invert max-w-lg break-words bg-gray-700/80 p-3 rounded-lg rounded-tl-none shadow">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        components={{
          // Customize link rendering to open in new tabs and add styling
          a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline" />,
          // You can add more custom renderers for other elements (h1, h2, ul, li, etc.) if needed for styling
          // For example, to style bullet points:
          // ul: ({node, ...props}) => <ul {...props} className="list-disc list-inside space-y-1" />,
          // li: ({node, ...props}) => <li {...props} className="ml-4" />,
        }}
      >
        {response}
      </ReactMarkdown>
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
              <UserAvatar user={currentUser} /> // Use UserAvatar component
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
        {/* Div to mark the end of messages for scrolling */}
        <div ref={messagesEndRef} /> 
      </div>
      {/* TODO: Add a ref and effect to scroll to bottom on new messages */}
    </div>
  );
};

export default ChatHistory; 
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage, UserInputAction } from './page'; // Import types from chat page
import { Bot, Youtube, Headset, AlertTriangle } from 'lucide-react'; // Added Youtube, Headset, AlertTriangle icons
import Image from 'next/image'; // Import NextImage
import { Session } from 'next-auth'; // Import Session type for currentUser prop
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown
import remarkGfm from 'remark-gfm';       // Import remarkGfm for GitHub Flavored Markdown
import ReactPlayer from 'react-player/lazy'; // Import ReactPlayer (lazy for better performance)

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

// Component to handle video player with error state
const VideoPlayer: React.FC<{ url: string }> = ({ url }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="my-3 p-3 rounded-md bg-red-900/30 text-red-300 flex items-center space-x-2 text-sm">
        <AlertTriangle size={18} />
        <span>Video could not be loaded. The link might be invalid or private.</span>
      </div>
    );
  }

  return (
    <div className="my-3 rounded-md overflow-hidden shadow-lg aspect-video bg-black">
      <ReactPlayer 
        url={url} 
        width='100%' 
        height='100%' 
        controls={true} 
        light={true} 
        onError={() => {
          console.warn("ReactPlayer error for URL:", url);
          setError(true);
        }}
      />
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
          // Enhanced link rendering
          a: ({node, href, ...props}) => {
            const linkUrl = href || '';
            // Check for YouTube links (more robustly)
            const isYouTube = ReactPlayer.canPlay(linkUrl) && (linkUrl.includes('youtube.com') || linkUrl.includes('youtu.be'));
            if (isYouTube) {
              // Basic check for common invalid YouTube ID patterns or very short links
              const videoIdMatch = linkUrl.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
              if (videoIdMatch && videoIdMatch[1]) {
                 return <VideoPlayer url={linkUrl} />;
              } else {
                // If it looks like YouTube but ID is suspect, provide a search link or a clickable link to the (possibly bad) URL
                return (
                    <a href={linkUrl} {...props} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 underline flex items-center space-x-1.5 my-1">
                        <Youtube size={16} /> 
                        <span>Watch on YouTube (Link may be incomplete)</span>
                    </a>
                );
              }
            }
            // Check for Spotify links (render as enhanced link for now)
            if (linkUrl.includes('open.spotify.com')) {
              return (
                <a 
                  href={linkUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 my-1 rounded-md bg-green-600 hover:bg-green-700 text-white text-xs font-medium transition-colors shadow-sm"
                >
                  <Headset size={14} /> 
                  <span>Listen on Spotify</span>
                </a>
              );
            }
            // Default link rendering
            return <a href={linkUrl} {...props} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline" />;
          },
          // Custom styling for lists
          ul: ({node, ...props}) => <ul {...props} className="list-disc list-inside space-y-1 my-2 pl-2" />,
          li: ({node, ...props}) => <li {...props} className="ml-4 text-gray-300" />,
          // Custom styling for headings if AI uses them for suggestions
          h1: ({node, ...props}) => <h1 {...props} className="text-xl font-semibold text-purple-300 mt-3 mb-1.5" />,
          h2: ({node, ...props}) => <h2 {...props} className="text-lg font-semibold text-purple-300 mt-2.5 mb-1" />,
          h3: ({node, ...props}) => <h3 {...props} className="text-md font-semibold text-purple-300 mt-2 mb-0.5" />,
          p: ({node, ...props}) => <p {...props} className="text-gray-200 my-1" />,
          strong: ({node, ...props}) => <strong {...props} className="text-purple-300" />
        }}
      >
        {response}
      </ReactMarkdown>
    </div>
  );

  return (
    <div className="flex-grow overflow-y-auto scroll-smooth px-4 pt-4">
    <div className=' w-full mx-auto max-w-3xl lg:max-w-5xl xl:max-w-6xl'>
      {messages.length === 0 && !isLoadingResponse && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <Bot size={48} className="mb-4" />
          <p className="text-lg">No messages yet.</p>
          <p className="text-sm">Start by selecting your mode and mood below.</p>
        </div>
      )}
      <div className="space-y-5 pb-4 pr-2"> {/* Added pr-2 for scrollbar spacing if needed */}
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
    </div>
  );
};

export default ChatHistory; 
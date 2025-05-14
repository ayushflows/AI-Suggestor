'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { UserInputAction } from './page'; // Import types from chat page
import { Zap, Smile, Frown, Annoyed, Sunrise, Sunset, MessageSquare, Send, Briefcase, Gamepad2, BookOpen, CheckCircle, Clock } from 'lucide-react';

interface ChatInputProps {
  onSubmit: (input: UserInputAction) => void;
  isLoading: boolean;
}

const modes = [
  { id: 'Work', name: 'Work', icon: <Briefcase size={18} /> },
  { id: 'Study', name: 'Study', icon: <BookOpen size={18} /> },
  { id: 'Gaming', name: 'Gaming', icon: <Gamepad2 size={18} /> },
];

const moods = [
  { id: 'Happy', name: 'Happy', icon: <Smile size={18} /> }, 
  { id: 'Stressed', name: 'Stressed', icon: <Frown size={18} /> },
  { id: 'Tired', name: 'Tired', icon: <Annoyed size={18} /> },
  { id: 'Energetic', name: 'Energetic', icon: <Zap size={18} /> }
];

const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, isLoading }) => {
  const [selectedMode, setSelectedMode] = useState<'Gaming' | 'Work' | 'Study' | '' >('');
  const [selectedMood, setSelectedMood] = useState<'Happy' | 'Stressed' | 'Tired' | 'Energetic' | '' >('');
  const [timeOfDay, setTimeOfDay] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 5) setTimeOfDay('Early Morning');
    else if (hour < 12) setTimeOfDay('Morning');
    else if (hour < 17) setTimeOfDay('Afternoon');
    else if (hour < 21) setTimeOfDay('Evening');
    else setTimeOfDay('Night');
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedMode || !selectedMood) {
      alert('Please select both a Mode and a Mood.');
      return;
    }
    // Also submit if message is present, even if mode/mood not selected (though UI forces mode/mood currently)
    if (!message.trim() && (!selectedMode || !selectedMood)) {
        alert('Please select Mode and Mood, or type a message.');
        return;
    }
    onSubmit({
      mode: selectedMode,
      mood: selectedMood,
      timeOfDay,
      message: message.trim(),
    });
    setMessage(''); 
  };

  const renderSelectorGroup = (
    options: Array<{ id: string; name: string; icon: React.JSX.Element }>,
    selectedValue: string,
    setter: (value: any) => void,
    label: string
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}:</label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt.id}
            type="button"
            disabled={isLoading}
            onClick={() => setter(opt.id as any)}
            className={`flex items-center justify-center space-x-2 px-3.5 py-2 rounded-md border text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 
              ${selectedValue === opt.id 
                ? 'bg-purple-600 border-purple-500 text-white shadow-md ring-2 ring-purple-500' 
                : 'bg-gray-700/60 border-gray-600 hover:bg-gray-600/80 hover:border-purple-500 text-gray-200 hover:text-white'
              }
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-700/60 disabled:hover:border-gray-600 disabled:ring-0
            `}
          >
            {opt.icon}
            <span>{opt.name}</span>
            {selectedValue === opt.id && <CheckCircle size={16} className="ml-1.5 text-white" />} 
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800/80 backdrop-blur-sm border-t border-gray-700/70 shadow-2xl p-3 md:p-4 flex-shrink-0 w-full mx-auto max-w-3xl lg:max-w-5xl xl:max-w-6xl mt-2">
      {/* Top row for selectors and time of day */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4 mb-3">
        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
          {renderSelectorGroup(modes, selectedMode, setSelectedMode, 'Select Mode')}
          {renderSelectorGroup(moods, selectedMood, setSelectedMood, 'Current Mood')}
        </div>
        <div className="flex-shrink-0 md:mt-[28px]"> {/* mt for label alignment */} 
          {/* <label className="block text-sm font-medium text-gray-300 mb-1.5 md:hidden">Time:</label> Hidden on md+ if label not needed */} 
          <div className="flex items-center space-x-2 bg-gray-700/70 px-3 py-1.5 rounded-full text-xs text-gray-300 shadow-sm">
            <Clock size={14} className="text-purple-400" />
            <span>{timeOfDay || 'Detecting...'}</span>
          </div>
        </div>
      </div>

      {/* Message input area - ChatGPT style */}
      <div className="relative flex items-end space-x-2">
        <textarea 
          id="message"
          rows={1} // Start with 1 row, auto-expands with content ideally (or use fixed 1-2 rows)
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as any); // Cast to any to satisfy FormEvent expectation if needed
            }
          }}
          disabled={isLoading}
          placeholder="Type your message or question..."
          className="flex-grow p-2.5 pr-12 rounded-lg bg-gray-700/90 border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white placeholder-gray-400 text-sm disabled:opacity-60 resize-none transition-colors duration-150 shadow-sm"
        />
        <button 
          type="submit" 
          disabled={isLoading || (!message.trim() && (!selectedMode || !selectedMood))}
          className="p-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-800 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-600 aspect-square flex items-center justify-center"
          aria-label="Send message"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>
    </form>
  );
};

export default ChatInput; 
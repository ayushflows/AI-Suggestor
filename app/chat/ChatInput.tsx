'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { UserInputAction } from './page'; // Import types from chat page
import { Zap, Smile, Frown, Annoyed, Sunrise, Sunset, MessageSquare, Send, Briefcase, Gamepad2, BookOpen } from 'lucide-react';

interface ChatInputProps {
  onSubmit: (input: UserInputAction) => void;
  isLoading: boolean;
}

const modes = [
  { name: 'Work', icon: <Briefcase size={18} /> },
  { name: 'Study', icon: <BookOpen size={18} /> },
  { name: 'Gaming', icon: <Gamepad2 size={18} /> },
];

const moods = [
  { name: 'Happy', icon: <Smile size={18} /> }, 
  { name: 'Stressed', icon: <Frown size={18} /> },
  { name: 'Tired', icon: <Annoyed size={18} /> },
  { name: 'Energetic', icon: <Zap size={18} /> }
];

const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, isLoading }) => {
  const [selectedMode, setSelectedMode] = useState<'Gaming' | 'Work' | 'Study' | '' >('');
  const [selectedMood, setSelectedMood] = useState<'Happy' | 'Stressed' | 'Tired' | 'Energetic' | '' >('');
  const [timeOfDay, setTimeOfDay] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Auto-detect time of day
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('Morning');
    else if (hour < 18) setTimeOfDay('Afternoon');
    else setTimeOfDay('Evening');
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedMode || !selectedMood || !timeOfDay) {
      // Basic validation, can be improved with user feedback
      alert('Please select Mode, Mood, and ensure Time of Day is set.');
      return;
    }
    onSubmit({
      mode: selectedMode,
      mood: selectedMood,
      timeOfDay,
      message: message.trim(),
    });
    setMessage(''); // Clear message input after submit
    // Optionally clear mode/mood too, or keep them for next message
    // setSelectedMode('');
    // setSelectedMood('');
  };

  const renderSelector = (
    options: Array<{ name: string; icon: React.JSX.Element }>,
    selectedValue: string,
    setter: (value: any) => void,
    groupName: string
  ) => (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt.name}
          type="button"
          disabled={isLoading}
          onClick={() => setter(opt.name as any)}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 
            ${selectedValue === opt.name 
              ? 'bg-purple-600 border-purple-500 text-white shadow-md' 
              : 'bg-gray-700/70 border-gray-600 hover:bg-gray-600/90 hover:border-gray-500 text-gray-200'}
            disabled:opacity-60 disabled:cursor-not-allowed
          `}
        >
          {opt.icon}
          <span>{opt.name}</span>
        </button>
      ))}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 md:p-5 border border-gray-700/70 shadow-xl mt-auto">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Select Mode:</label>
          {renderSelector(modes, selectedMode, setSelectedMode, 'mode')}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Current Mood:</label>
          {renderSelector(moods, selectedMood, setSelectedMood, 'mood')}
        </div>

        <div>
          <label htmlFor="timeOfDay" className="block text-sm font-medium text-gray-300 mb-1.5">Time of Day:</label>
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                {timeOfDay === 'Morning' ? <Sunrise size={18} className="text-gray-400" /> : 
                 timeOfDay === 'Afternoon' ? <Sunset size={18} className="text-gray-400" /> : // Placeholder, could use a Sun icon
                 <Sunset size={18} className="text-gray-400" />} 
            </div>
            <input 
                id="timeOfDayInput" 
                type="text" 
                value={timeOfDay} 
                onChange={(e) => setTimeOfDay(e.target.value)} 
                disabled={isLoading}
                placeholder="e.g., Morning, Afternoon, Evening"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-700/90 border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white placeholder-gray-400 disabled:opacity-60"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1.5">Optional Message:</label>
          <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MessageSquare size={18} className="text-gray-400" />
              </div>
            <textarea 
              id="message"
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
              placeholder="Type any additional details or questions..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-700/90 border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white placeholder-gray-400 disabled:opacity-60 resize-none"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading || !selectedMode || !selectedMood || !timeOfDay}
          className="w-full flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : (
            <><Send size={18} className="mr-2.5" /> Send Context & Message</>
          )}
        </button>
      </div>
    </form>
  );
};

export default ChatInput; 
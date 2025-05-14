import OpenAI from 'openai';
import { UserInputAction, ChatMessage } from '@/app/chat/page'; // Assuming types are exported from here

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to simplify history for the prompt
const formatHistoryForPrompt = (history: ChatMessage[]): OpenAI.Chat.Completions.ChatCompletionMessageParam[] => {
  return history.map(msg => {
    if (msg.isUser && msg.userInput) {
      return {
        role: 'user',
        // Simplified user message for history to keep it concise
        content: `Previously, I was in ${msg.userInput.mode} mode, feeling ${msg.userInput.mood}. My message was: "${msg.userInput.message || '(No additional message)'}"`
      };
    }
    if (!msg.isUser && msg.aiResponse) {
      return { role: 'assistant', content: msg.aiResponse }; // Keep AI full response for context
    }
    return null;
  }).filter(Boolean) as OpenAI.Chat.Completions.ChatCompletionMessageParam[];
};

export async function getOpenAiResponse(
  currentUserInput: UserInputAction,
  chatHistory: ChatMessage[] = []
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    console.error('OpenAI API key not configured.');
    throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.');
  }

  const systemPrompt = `You are AIProductiv, an advanced AI productivity assistant. Your goal is to provide 2-3 concrete, actionable, and engaging suggestions to help users be more productive or manage their current state based on their mode (Work, Study, Gaming), mood (Happy, Stressed, Tired, Energetic), and time of day.

Your response MUST be formatted using Markdown and should be structured clearly.

For each suggestion, consider including:
1.  **Actionable Task:** What the user should DO (e.g., "Take a 5-minute mindful break", "Review your top 3 priorities for the day", "Try a 10-minute stretching routine").
2.  **App/Site/Resource Recommendation:** Suggest a relevant app, website, YouTube video, Spotify playlist, or other online resource. If you suggest a link, provide it in Markdown format, e.g., [Resource Name](URL). For YouTube, try to find a relevant video. For music, try to suggest a genre or a playlist (e.g., [Lo-Fi Beats for Studying](https://open.spotify.com/playlist/your-suggested-playlist-id) or search query).
3.  **AI-Generated Quote/Advice (Optional but encouraged):** A short, inspiring, or relevant quote or piece of advice related to the context.

Structure your response with clear headings or bullet points for each of the 2-3 suggestions. Ensure variety in your suggestions.

Example of how to format a suggestion with a link:
-   **Suggestion 1: Focus Boost**
    *   **Action:** Try the Pomodoro Technique for your next study block (25 min focus, 5 min break).
    *   **Resource:** Check out this [Pomodoro Timer App](https://pomofocus.io/).
    *   **Quote:** "The secret of getting ahead is getting started." - Mark Twain

Tailor your response carefully to the user's current mode, mood, and time of day.
If mode is Gaming: suggest short breaks, ergonomic tips, or game-related strategies.
If mode is Study: offer focus techniques, learning resources, or break ideas.
If mode is Work: provide task management tips, stress relief suggestions, or focus enhancers.

Keep your overall response concise and easy to digest, even with multiple suggestions. Prioritize helpfulness and engagement.`;

  const formattedHistory = formatHistoryForPrompt(chatHistory.slice(-4)); // Use last 4 messages (2 user, 2 AI turns typically)

  const userMessageContent = 
`My current situation:
- Mode: ${currentUserInput.mode}
- Mood: ${currentUserInput.mood}
- Time of Day: ${currentUserInput.timeOfDay}
${currentUserInput.message ? `- My Message: "${currentUserInput.message}"` : '(No additional message from me)'}

Please provide 2-3 actionable and engaging suggestions based on this.`;

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...formattedHistory,
    { role: 'user', content: userMessageContent },
  ];

  try {
    console.log("Sending to OpenAI with messages:", JSON.stringify(messages, null, 2));
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Or gpt-4 if preferred and available
      messages: messages,
      temperature: 0.75, // Slightly higher for more creative/varied suggestions
      max_tokens: 350,  // Increased to allow for more detailed, multi-part suggestions
      top_p: 1,
      frequency_penalty: 0.1, // Slightly penalize to reduce repetitive phrasing
      presence_penalty: 0.1,  // Slightly encourage new topics/ideas
    });

    const responseContent = completion.choices[0]?.message?.content;
    console.log("OpenAI Raw Response Content:", responseContent);

    if (!responseContent) {
      throw new Error('No content in OpenAI response.');
    }
    return responseContent.trim();

  } catch (error) {
    console.error('Error fetching from OpenAI:', error);
    let errorMessage = 'Failed to get response from AI assistant.';
    if (error instanceof Error && error.message) {
        errorMessage = error.message;
    }
    // It might be better to throw the original error or a more specific custom error
    throw new Error(`OpenAI API Error: ${errorMessage}`);
  }
} 
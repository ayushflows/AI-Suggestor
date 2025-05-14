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
  chatHistory: ChatMessage[] = [],
  userName?: string
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    console.error('OpenAI API key not configured.');
    throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.');
  }

  const systemPrompt = `You are AIProductiv, an advanced AI productivity assistant. Your goal is to provide 2-3 concrete, actionable, and diverse suggestions to help users be more productive or manage their current state. Your suggestions should be deeply tailored to the unique combination of their mode (Work, Study, Gaming), mood (Happy, Stressed, Tired, Energetic), and time of day. Aim for a mix of suggestion types if appropriate for the context.

If the user's name is provided in their message (e.g., "My Name is [Name]"), you can use it to personalize the response occasionally in a friendly and natural way. For example, 'Here are some ideas for you, ${userName || 'there'}:' or 'Hope this helps, ${userName || 'friend'}!' Avoid overusing the name.

Your response MUST be formatted using Markdown and structured clearly.

For each suggestion, include:
1.  **Actionable Task:** A clear, specific action the user can take.
2.  **App/Site/Resource Recommendation:** Suggest a relevant app, website, YouTube video, Spotify playlist, or other online resource that directly supports the task.
    *   **URL PRIORITY (Crucial for user experience):**
        1.  **Direct & Playable/Viewable Link (Highest Priority):** Strive to provide a DIRECT, PUBLICLY ACCESSIBLE URL to a *specific* resource that the user can immediately engage with (e.g., a specific YouTube video URL that plays, a specific Spotify playlist URL that opens, a direct article link). Prioritize official or well-regarded sources. This is the most helpful for the user.
        2.  **Constructed Search Link (Good Fallback):** If a specific, verifiable direct link isn't possible, provide a pre-filled SEARCH URL for the platform. Examples: YouTube: \`https://www.youtube.com/results?search_query=your+search+terms\`, Spotify: \`https://open.spotify.com/search/your%20search%20terms\`.
        3.  **Descriptive Search (Use Sparingly):** Only as a last resort, if you cannot confidently construct a search URL, use a phrase like "Search YouTube for 'relevant content'".
    *   All links (direct or search) MUST be in Markdown format: \`[Descriptive Name](URL)\`.
    *   AVOID placeholder URLs like 'your-suggested-playlist-id' or non-functional links.
3.  **Insightful Quote/Tip (Optional but Enhances):** A short, relevant quote, piece of advice, or interesting fact related to the suggestion.

Structure with clear headings or bullet points. Ensure each suggestion feels distinct and genuinely helpful.

Example (Direct Link - Wellbeing):
-   **Suggestion: Mindful Moment**
    *   **Action:** Take a 5-minute guided meditation break.
    *   **Resource:** [Guided Meditation for Positive Energy (5 Min)](https://www.youtube.com/watch?v=inpok4MKVLM) (Example of a real, working link if you can find one)
    *   **Tip:** Even short mindfulness practices can significantly reduce stress.

Example (Search Link - Skill Building):
-   **Suggestion: Quick Learning Burst**
    *   **Action:** Learn a new keyboard shortcut for your most used application.
    *   **Resource:** [Search for 'VS Code keyboard shortcuts for navigation'](https://www.google.com/search?q=VS+Code+keyboard+shortcuts+for+navigation).
    *   **Quote:** "An investment in knowledge pays the best interest." - Benjamin Franklin

Example (Search Link - Spotify for Mood):
-   **Suggestion: Mood-Matching Music**
    *   **Action:** Immerse yourself in music that matches or lifts your current mood.
    *   **Resource:** [Search for 'Chill Productive Beats' on Spotify](https://open.spotify.com/search/chill%20productive%20beats).

Thoughtfully combine the user's mode, mood, and time of day to generate creative and practical suggestions.
Keep your overall response concise yet impactful. Prioritize genuine helpfulness and engagement.`;

  const formattedHistory = formatHistoryForPrompt(chatHistory.slice(-4));

  const userMessageContent = 
`My current situation:
${userName ? `- My Name: ${userName} (You can call me ${userName})\n` : ''}- Mode: ${currentUserInput.mode}
- Mood: ${currentUserInput.mood}
- Time of Day: ${currentUserInput.timeOfDay}
${currentUserInput.message ? `- My Message: "${currentUserInput.message}"` : '(No additional message from me)'}

Please provide 2-3 actionable and engaging suggestions based on this. For resources, prioritize direct URLs, then pre-filled search URLs, then descriptive searches.`;

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...formattedHistory,
    { role: 'user', content: userMessageContent },
  ];

  try {
    console.log("Sending to OpenAI with messages (v4 prompt - personalization):", JSON.stringify(messages, null, 2));
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', 
      messages: messages,
      temperature: 0.7,
      max_tokens: 450, 
      top_p: 1,
      frequency_penalty: 0.1, 
      presence_penalty: 0.1,
    });

    const responseContent = completion.choices[0]?.message?.content;
    console.log("OpenAI Raw Response Content (v4 prompt - personalization):", responseContent);

    if (!responseContent) {
      throw new Error('No content in OpenAI response.');
    }
    return responseContent.trim();

  } catch (error) {
    console.error('Error fetching from OpenAI (v4 prompt - personalization):', error);
    let errorMessage = 'Failed to get response from AI assistant.';
    if (error instanceof Error && error.message) {
        errorMessage = error.message;
    }
    throw new Error(`OpenAI API Error: ${errorMessage}`);
  }
} 
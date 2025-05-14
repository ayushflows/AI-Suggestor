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
        content: `Mode: ${msg.userInput.mode}, Mood: ${msg.userInput.mood}, Time: ${msg.userInput.timeOfDay}. Message: ${msg.userInput.message || '(No additional message)'}`
      };
    }
    if (!msg.isUser && msg.aiResponse) {
      return { role: 'assistant', content: msg.aiResponse };
    }
    return null; // Should not happen with valid ChatMessage objects
  }).filter(msg => msg !== null) as OpenAI.Chat.Completions.ChatCompletionMessageParam[];
};

export async function getOpenAiResponse(
  currentUserInput: UserInputAction,
  chatHistory: ChatMessage[] = [] // Provide last few messages for context
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    console.error('OpenAI API key not configured.');
    throw new Error('OpenAI API key not configured.');
  }

  const systemPrompt = `You are AIProductiv, a helpful assistant designed to enhance user productivity based on their current mode (Work, Study, Gaming), mood (Happy, Stressed, Tired, Energetic), and time of day. Provide concise, actionable advice, suggestions, or empathetic responses. If the mode is Gaming, suggest short breaks or game-related tips. If Study, offer focus techniques or learning resources. If Work, provide task management tips or stress relief suggestions. Tailor your response to their mood and time of day. Keep responses relatively brief and focused.`;

  const formattedHistory = formatHistoryForPrompt(chatHistory.slice(-4)); // Use last 4 messages for context

  const userMessageContent = `Current context: Mode - ${currentUserInput.mode}, Mood - ${currentUserInput.mood}, Time - ${currentUserInput.timeOfDay}. My optional message: "${currentUserInput.message || '(No additional message)'}". What should I do or focus on?`;

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...formattedHistory,
    { role: 'user', content: userMessageContent },
  ];

  try {
    console.log("Sending to OpenAI with messages:", JSON.stringify(messages, null, 2));
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Or 'gpt-4' if you have access and prefer it
      messages: messages,
      temperature: 0.7, // Adjust for creativity vs. determinism
      max_tokens: 150, // Adjust based on desired response length
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const responseContent = completion.choices[0]?.message?.content;
    console.log("OpenAI Response Content:", responseContent);

    if (!responseContent) {
      throw new Error('No content in OpenAI response.');
    }
    return responseContent.trim();

  } catch (error) {
    console.error('Error fetching from OpenAI:', error);
    // Consider more specific error handling or re-throwing a custom error
    throw new Error('Failed to get response from AI assistant.');
  }
} 
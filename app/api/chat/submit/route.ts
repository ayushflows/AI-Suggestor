import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { getOpenAiResponse } from '@/lib/openaiService';
import { UserInputAction, ChatMessage } from '@/app/chat/page'; // Client-side ChatMessage type
import clientPromise from '@/lib/mongodb';
import { ObjectId, MongoClient, Db } from 'mongodb';

// MongoDB document structure
interface ChatMessageDocument {
  _id?: ObjectId;
  userId: ObjectId;
  timestamp: Date;
  isUser: boolean;
  // Fields from UserInputAction if isUser is true
  userInputMode?: 'Gaming' | 'Work' | 'Study' | '';
  userInputMood?: 'Happy' | 'Stressed' | 'Tired' | 'Energetic' | '';
  userInputTimeOfDay?: string;
  userMessageText?: string;
  // Field for AI response if isUser is false
  aiResponseText?: string;
}

const MAX_HISTORY_LENGTH = 5;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = new ObjectId(session.user.id);

    const body = await req.json();
    const userInput: UserInputAction = body.userInput;
    const clientHistory: ChatMessage[] = body.history || [];

    if (!userInput || !userInput.mode || !userInput.mood || !userInput.timeOfDay) {
      return NextResponse.json({ message: 'Bad Request: Missing required userInput fields.' }, { status: 400 });
    }

    const client: MongoClient = await clientPromise;
    const db: Db = client.db(); 
    const chatCollection = db.collection<ChatMessageDocument>('chat_messages');

    // 1. Save User's Message
    const userMessageDoc: ChatMessageDocument = {
      userId,
      timestamp: new Date(),
      isUser: true,
      userInputMode: userInput.mode,
      userInputMood: userInput.mood,
      userInputTimeOfDay: userInput.timeOfDay,
      userMessageText: userInput.message || '',
    };
    await chatCollection.insertOne(userMessageDoc);
    console.log(`[API Chat Submit] User message saved for user ${userId}`);

    // 2. Get AI Response
    // Pass the client-side history to OpenAI service for context generation
    const aiResponseText = await getOpenAiResponse(userInput, clientHistory);

    // 3. Save AI's Message
    const aiMessageDoc: ChatMessageDocument = {
      userId,
      timestamp: new Date(), // Slightly later timestamp than user message
      isUser: false,
      aiResponseText,
    };
    await chatCollection.insertOne(aiMessageDoc);
    console.log(`[API Chat Submit] AI response saved for user ${userId}`);

    // 4. Maintain only the last MAX_HISTORY_LENGTH messages for this user
    const userMessages = await chatCollection.find({ userId }).sort({ timestamp: 1 }).toArray();
    if (userMessages.length > MAX_HISTORY_LENGTH) {
      const messagesToDeleteCount = userMessages.length - MAX_HISTORY_LENGTH;
      const oldestMessageIds = userMessages.slice(0, messagesToDeleteCount).map(msg => msg._id as ObjectId);
      if (oldestMessageIds.length > 0) {
        await chatCollection.deleteMany({ _id: { $in: oldestMessageIds } });
        console.log(`[API Chat Submit] Deleted ${oldestMessageIds.length} oldest messages for user ${userId} to maintain history length.`);
      }
    }

    return NextResponse.json({ aiResponse: aiResponseText }, { status: 200 });

  } catch (error) {
    console.error('[API /api/chat/submit] Error:', error);
    let errorMessage = 'An internal server error occurred.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ message: 'Error processing chat message.', error: errorMessage }, { status: 500 });
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import clientPromise from '@/lib/mongodb';
import { ObjectId, MongoClient, Db } from 'mongodb';
import { ChatMessage } from '@/app/chat/page'; // Client-side ChatMessage type

// Re-define MongoDB document structure (or import from a shared types file if created)
interface ChatMessageDocument {
  _id?: ObjectId;
  userId: ObjectId;
  timestamp: Date;
  isUser: boolean;
  userInputMode?: 'Gaming' | 'Work' | 'Study' | '';
  userInputMood?: 'Happy' | 'Stressed' | 'Tired' | 'Energetic' | '';
  userInputTimeOfDay?: string;
  userMessageText?: string;
  aiResponseText?: string;
}

const MAX_HISTORY_TO_FETCH = 5;

// Helper function to map MongoDB document to client-side ChatMessage type
function mapDocumentToChatMessage(doc: ChatMessageDocument): ChatMessage {
  const chatMsg: ChatMessage = {
    id: doc._id!.toString(), // Ensure _id is converted to string
    isUser: doc.isUser,
    timestamp: doc.timestamp,
  };
  if (doc.isUser) {
    chatMsg.userInput = {
      mode: doc.userInputMode || '',
      mood: doc.userInputMood || '',
      timeOfDay: doc.userInputTimeOfDay || '',
      message: doc.userMessageText || '',
    };
  } else {
    chatMsg.aiResponse = doc.aiResponseText || '';
  }
  return chatMsg;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = new ObjectId(session.user.id);

    const client: MongoClient = await clientPromise;
    const db: Db = client.db();
    const chatCollection = db.collection<ChatMessageDocument>('chat_messages');

    const userMessagesDocs = await chatCollection
      .find({ userId })
      .sort({ timestamp: -1 }) // Fetch newest first
      .limit(MAX_HISTORY_TO_FETCH)
      .toArray();
    
    // The messages are newest first, client usually expects oldest first for display order
    const formattedMessages = userMessagesDocs.reverse().map(mapDocumentToChatMessage);

    console.log(`[API Chat History] Fetched ${formattedMessages.length} messages for user ${userId}`);

    return NextResponse.json(formattedMessages, { status: 200 });

  } catch (error) {
    console.error('[API /api/chat/history] Error:', error);
    let errorMessage = 'An internal server error occurred.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ message: 'Error fetching chat history.', error: errorMessage }, { status: 500 });
  }
} 
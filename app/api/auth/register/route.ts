import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { MongoClient, Db, ObjectId } from 'mongodb';

// Re-defining a similar user type here for clarity, or import from a shared types file
interface NewUser {
  _id?: ObjectId;
  name?: string;
  email?: string;
  password?: string;
  emailVerified?: Date | null; // NextAuth adapter might set this
  image?: string | null; // NextAuth adapter might set this - updated type
  createdAt: Date;
  updatedAt: Date;
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields (name, email, password).' }, { status: 400 });
    }

    // Basic email validation (consider a more robust library for production)
    if (!/\S+@\S+\.\S+/.test(email)) {
        return NextResponse.json({ message: 'Invalid email format.' }, { status: 400 });
    }

    // Basic password length (consider more complex rules for production)
    if (password.length < 6) {
        return NextResponse.json({ message: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const client: MongoClient = await clientPromise;
    const db: Db = client.db(); // Ensure your MONGODB_URI has the database name
    const usersCollection = db.collection<NewUser>('users');

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists.' }, { status: 409 }); // 409 Conflict
    }

    const hashedPassword = await bcrypt.hash(password, 12); // Salt rounds: 10-12 is common

    const newUser: NewUser = {
      name,
      email,
      password: hashedPassword,
      emailVerified: null, // Typically email is not verified on direct registration like this
      image: null , // Default to null for no image
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);
    
    console.log("New user registered:", result.insertedId, email);

    // Don't send back the password, even hashed
    return NextResponse.json({
      message: 'User registered successfully!',
      userId: result.insertedId 
    }, { status: 201 });

  } catch (error) {
    console.error('[API Register] Error:', error);
    let errorMessage = 'An unexpected error occurred.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ message: 'Error registering user', error: errorMessage }, { status: 500 });
  }
} 
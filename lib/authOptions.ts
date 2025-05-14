/* eslint-disable */
import { NextAuthOptions, User as NextAuthUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb"; // Assuming this path is correct from the new location
import bcrypt from 'bcryptjs';
import { MongoClient, Db, ObjectId } from 'mongodb';

// Define a custom user type that includes the password (optional) and MongoDB _id
interface MongoUser extends NextAuthUser {
  _id: ObjectId; // MongoDB stores id as _id of type ObjectId
  password?: string;
  // other properties like name, email, image are inherited from NextAuthUser
}

// Environment variable checks should ideally be done where they are first used or at app startup
// For NextAuthOptions, they are used here.
if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("Missing GOOGLE_CLIENT_ID in .env.local");
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing GOOGLE_CLIENT_SECRET in .env.local");
}
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("Missing NEXTAUTH_SECRET in .env.local");
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing email or password');
        }

        const client: MongoClient = await clientPromise;
        const db: Db = client.db();
        const usersCollection = db.collection<MongoUser>('users');

        const user = await usersCollection.findOne({ email: credentials.email });

        if (!user) {
          console.log("[NextAuth][Authorize] No user found with email:", credentials.email);
          return null;
        }

        if (!user.password) {
          console.log("[NextAuth][Authorize] User signed up with OAuth, no password set for:", user.email);
          return null; 
        }

        const passwordIsValid = await bcrypt.compare(credentials.password, user.password);

        if (!passwordIsValid) {
          console.log("[NextAuth][Authorize] Invalid password for user:", credentials.email);
          return null;
        }

        console.log("[NextAuth][Authorize] Credentials authentication successful for:", user.email);
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
        };
      }
    })
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET!,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        if (token.sub) session.user.id = token.sub; 
        if (token.name) session.user.name = token.name;
        if (token.email) session.user.email = token.email; 
        if (token.picture) session.user.image = token.picture; 
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) { 
        token.id = user.id; 
      }
      return token;
    }
  },
  debug: process.env.NODE_ENV === 'development',
}; 
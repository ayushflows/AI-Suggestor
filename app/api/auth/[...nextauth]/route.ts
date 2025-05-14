import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Adjusted import path

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    user?: {
      id?: string | null; // Add your custom property id
    } & DefaultSession["user"];
  }

  // If you want to add properties to the User model itself (stored in the database)
  // interface User extends DefaultUser {
  //   id: string; // Ensure User model also has id if you are extensively using it
  // }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    /** OpenID ID Token */
    id?: string;
    // You can add other custom properties to the JWT token here
  }
} 
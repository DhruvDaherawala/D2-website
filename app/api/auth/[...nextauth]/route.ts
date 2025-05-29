import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

// Extend the Session type to include user id
interface ExtendedSession extends Session {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

// This is a simple admin-only authentication system
// In production, you would want to use a database to store users
const adminUser = {
  id: "1",
  name: "Admin",
  email: process.env.ADMIN_EMAIL || "dhruv@gmail.com",
  // In production, store this as a hashed value in .env
  passwordHash: process.env.ADMIN_PASSWORD_HASH || "$2b$10$GMFm1gfMswnUKv5cWOScbevK0TrtSs0OxSFL1krJ9Px1k4OdLbhnS", // Default: "Dhruv@1479"
};

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        if (credentials.email !== adminUser.email) {
          return null;
        }

        const isValidPassword = await compare(
          credentials.password,
          adminUser.passwordHash
        );

        if (!isValidPassword) {
          return null;
        }

        return {
          id: adminUser.id,
          name: adminUser.name,
          email: adminUser.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      // Make sure session.user exists before assigning id
      if (token && session.user) {
        (session as ExtendedSession).user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});

export { handler as GET, handler as POST }; 
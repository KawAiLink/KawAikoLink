import { NextRequest } from "next/server";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { calculateAge } from "@/utils/calculateAge";

// Import your type enums only
import { FemboyRole, SexualOrientation } from "@/types/schema/enums";

// Extend NextAuth types without circular references
declare module "next-auth" {
  interface User {
    id: string;
    username?: string;
    mobileNumber?: string | null;
    country?: string;
    dateOfBirth?: Date;
    age?: Number;
    bio?: string | null;
    avatarUrl?: string | null;
    hobbies?: string[];
    femboy?: FemboyRole | null;
    sexualOrientation?: SexualOrientation | null;
    dateEnabled?: boolean;
    preferences?: any;
  }

  interface Session {
    user: User,
    redirect?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username?: string;
    mobileNumber?: string | null;
    country?: string;
    dateOfBirth?: Date;
    bio?: string | null;
    avatarUrl?: string | null;
    hobbies?: string[];
    femboy?: FemboyRole | null;
    sexualOrientation?: SexualOrientation | null;
    dateEnabled?: boolean;
    preferences?: any;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Enter your email" },
        password: { label: "Password", type: "password", placeholder: "Enter your password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { preferences: true },
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        const hashedInput = crypto.pbkdf2Sync(
          credentials.password,
          user.salt,
          100000,
          64,
          "sha512"
        ).toString("hex");

        if (hashedInput !== user.password) {
          throw new Error("Invalid password");
        }

        // Return user with converted ID to string to be compatible with NextAuth
        return {
          id: String(user.id),
          email: user.email,
          name: user.username,
          username: user.username,
          mobileNumber: user.mobileNumber,
          country: user.country,
          dateOfBirth: user.dateOfBirth,
          bio: user.bio,
          avatarUrl: user.avatarUrl,
          hobbies: user.hobbies,
          // Use as any to avoid enum type conflicts between Prisma and your custom enums
          femboy: user.preferences?.femboy as any,
          sexualOrientation: user.preferences?.sexualOrientation as any,
          dateEnabled: user.dateEnabled,
          preferences: user.preferences
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.username = user.username;
        token.mobileNumber = user.mobileNumber;
        token.country = user.country;
        token.dateOfBirth = user.dateOfBirth;
        token.bio = user.bio;
        token.avatarUrl = user.avatarUrl;
        token.hobbies = user.hobbies;
        token.femboy = user.femboy;
        token.sexualOrientation = user.sexualOrientation;
        token.dateEnabled = user.dateEnabled;
        token.preferences = user.preferences;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email as string;
      session.user.name = token.name;
      session.user.username = token.username;
      session.user.mobileNumber = token.mobileNumber;
      session.user.country = token.country;
      session.user.dateOfBirth = token.dateOfBirth;
      session.user.age = token.dateOfBirth ? calculateAge(token.dateOfBirth) : null;
      session.user.bio = token.bio;
      session.user.avatarUrl = token.avatarUrl;
      session.user.hobbies = token.hobbies;
      session.user.femboy = token.femboy;
      session.user.sexualOrientation = token.sexualOrientation;
      session.user.dateEnabled = token.dateEnabled;
      session.user.preferences = token.preferences;

      // Add redirect if preferences not set
      if (!session.user.preferences) {
        session.redirect = "/account/setup";
      }
        
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
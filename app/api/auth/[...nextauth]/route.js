import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { calculateAge } from "@/utils/calculateAge";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Enter your email" },
                password: { label: "Password", type: "password", placeholder: "Enter your password" },
            },
            async authorize(credentials) {
                if (!credentials.email || !credentials.password) {
                    throw new Error("Email and password are required");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    include: {
                        preferences: true,
                    },
                });

                if (!user) {
                    throw new Error("No user found with this email");
                }

                // Verify the password using the salt
                const hashedInput = crypto.pbkdf2Sync(
                    credentials.password,
                    user.salt, // Use the salt stored in the database
                    100000,
                    64,
                    "sha512"
                ).toString("hex");

                if (hashedInput !== user.password) {
                    throw new Error("Invalid password");
                }

                return {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    mobileNumber: user.mobileNumber,
                    country: user.country,
                    dateOfBirth: user.dateOfBirth,
                    bio: user.bio,
                    avatarUrl: user.avatarUrl,
                    hobbies: user.hobbies,
                    femboy: user.preferences?.femboy,
                    sexualOrientation: user.preferences?.sexualOrientation,
                    dateEnabled: user.dateEnabled,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
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
            }
            return token;
        },
        async session({ session, token }) {
            session.user = {
                id: token.id,
                email: token.email,
                username: token.username,
                mobileNumber: token.mobileNumber,
                country: token.country,
                dateOfBirth: token.dateOfBirth,
                age: token.dateOfBirth ? calculateAge(token.dateOfBirth) : null,
                bio: token.bio,
                avatarUrl: token.avatarUrl,
                hobbies: token.hobbies,
                femboy: token.femboy,
                sexualOrientation: token.sexualOrientation,
                dateEnabled: token.dateEnabled,
            };

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
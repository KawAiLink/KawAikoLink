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
                        preferences: true, // Include preferences in the query
                    },
                });

                if (!user) {
                    throw new Error("No user found with this email");
                }

                const [salt, storedHashedPassword] = user.password.split(":");
                const hashedInput = crypto.pbkdf2Sync(
                    credentials.password,
                    salt,
                    100000,
                    64,
                    "sha512"
                ).toString("hex");

                if (hashedInput !== storedHashedPassword) {
                    throw new Error("Invalid password");
                }

                return {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    mobileNumber: user.mobileNumber,
                    country: user.country,
                    dateOfBirth: user.dateOfBirth,
                    bio: user.bio, // Add bio
                    avatarUrl: user.avatarUrl, // Add avatarUrl
                    hobbies: user.hobbies, // Add hobbies
                    femboy: user.preferences?.femboy, // Add femboy
                    sexualOrientation: user.preferences?.sexualOrientation, // Add sexualOrientation
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
                token.bio = user.bio; // Add bio
                token.avatarUrl = user.avatarUrl; // Add avatarUrl
                token.hobbies = user.hobbies; // Add hobbies
                token.femboy = user.femboy; // Add femboy
                token.sexualOrientation = user.sexualOrientation; // Add sexualOrientation
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
                bio: token.bio, // Add bio
                avatarUrl: token.avatarUrl, // Add avatarUrl
                hobbies: token.hobbies, // Add hobbies
                femboy: token.femboy, // Add femboy
                sexualOrientation: token.sexualOrientation, // Add sexualOrientation
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
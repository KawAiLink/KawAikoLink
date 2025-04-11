import crypto from "crypto";
import { parsePhoneNumberFromString, isValidPhoneNumber } from "libphonenumber-js";
import prisma from "@/lib/prisma";

export async function POST(req) {
    try {
        const { email, username, mobileNumber, password, dateOfBirth } = await req.json();

        // Validate required fields
        if (!email || !username || !mobileNumber || !password || !dateOfBirth) {
            return Response.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        // Validate phone number format
        if (!isValidPhoneNumber(mobileNumber)) {
            return Response.json(
                { message: "Invalid phone number format" },
                { status: 400 }
            );
        }

        // Parse phone number to extract country code
        const phoneNumber = parsePhoneNumberFromString(mobileNumber);
        const countryCode = phoneNumber?.country;

        if (!countryCode) {
            return Response.json(
                { message: "Unable to determine country from phone number" },
                { status: 400 }
            );
        }

        // Check if user with the same email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return Response.json(
                { message: "User with this email already exists" },
                { status: 409 }
            );
        }

        // Generate salt and hash the password
        const salt = crypto.randomBytes(16).toString("hex");
        const hashedPassword = crypto
            .pbkdf2Sync(password, salt, 100000, 64, "sha512")
            .toString("hex");

        // Generate a secret key for the user
        const secretKey = crypto.randomBytes(32).toString("hex");

        // Create the new user in the database
        const newUser = await prisma.user.create({
            data: {
                email,
                username,
                mobileNumber,
                country: countryCode,
                password: hashedPassword, // Store only the hashed password
                salt, // Store the salt in a separate column
                secretKey,
                dateOfBirth: new Date(dateOfBirth),
                dateEnabled: false, // Explicitly set `dateEnabled` to false
            },
        });

        // Return success response
        return Response.json(
            { message: "Registration successful" },
            { status: 201 }
        );
    } catch (err) {
        console.error(err);
        return Response.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
import crypto from "crypto";
import { parsePhoneNumberFromString, isValidPhoneNumber } from "libphonenumber-js";
import prisma from "@/lib/prisma";

export async function POST(req) {
    try {
        const { email, username, mobileNumber, password, dateOfBirth } = await req.json();

        if (!email || !username || !mobileNumber || !password || !dateOfBirth) {
            return Response.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        if (!isValidPhoneNumber(mobileNumber)) {
            return Response.json(
                { message: "Invalid phone number format" },
                { status: 400 }
            );
        }

        const phoneNumber = parsePhoneNumberFromString(mobileNumber);
        const countryCode = phoneNumber?.country;

        if (!countryCode) {
            return Response.json(
                { message: "Unable to determine country from phone number" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return Response.json(
                { message: "User with this email already exists" },
                { status: 409 }
            );
        }

        const salt = crypto.randomBytes(16).toString("hex");
        const hashedPassword = crypto
            .pbkdf2Sync(password, salt, 100000, 64, "sha512")
            .toString("hex");

        const secretKey = crypto.randomBytes(32).toString("hex");

        const newUser = await prisma.user.create({
            data: {
                email,
                username,
                mobileNumber,
                country: countryCode,
                password: `${salt}:${hashedPassword}`,
                salt,
                secretKey,
                dateOfBirth: new Date(dateOfBirth),
            },
        });

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
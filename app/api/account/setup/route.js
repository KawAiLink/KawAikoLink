// app/api/user/update/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route"; // Import your authOptions
import prisma from "@/lib/prisma";

export async function PUT(req) {
    try {
        // Get the session
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Extract user ID from the session
        const userId = session.user.id;

        // Parse the request body
        const { bio, avatarUrl, hobbies, mode, femboy, sexualOrientation, dateEnabled } =
            await req.json();

        // Update the user's data in the database
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                bio,
                avatarUrl,
                hobbies,
                dateEnabled, // Add dateEnabled to the update
                preferences: {
                    upsert: {
                        create: { mode, femboy, sexualOrientation },
                        update: { mode, femboy, sexualOrientation },
                    },
                },
            },
            include: {
                preferences: true, // Include preferences in the response
            },
        });

        // Return the updated user data
        return Response.json(
            {
                message: "Preferences updated successfully",
                user: {
                    id: updatedUser.id,
                    email: updatedUser.email,
                    username: updatedUser.username,
                    mobileNumber: updatedUser.mobileNumber,
                    country: updatedUser.country,
                    dateOfBirth: updatedUser.dateOfBirth,
                    bio: updatedUser.bio,
                    avatarUrl: updatedUser.avatarUrl,
                    hobbies: updatedUser.hobbies,
                    dateEnabled: updatedUser.dateEnabled,
                    mode: updatedUser.preferences.mode,
                    femboy: updatedUser.preferences.femboy,
                    sexualOrientation: updatedUser.preferences.sexualOrientation,
                },
            },
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return Response.json({ message: "Failed to update preferences" }, { status: 500 });
    }
}
// app/api/account/setup/route.js
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
        const userId = Number(session.user.id);

        // Parse the request body
        const { bio, avatarUrl, hobbies, femboy, sexualOrientation, dateEnabled } = await req.json();

        // Update the user's data in the database
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                bio,
                avatarUrl,
                hobbies,
                dateEnabled,
                preferences: {
                    upsert: {
                        create: { femboy, sexualOrientation },
                        update: { femboy, sexualOrientation },
                    },
                },
            },
            include: {
                preferences: true,
            },
        });

        // Return the updated user data
        return Response.json(
            {
                message: "Preferences updated successfully",
                user: updatedUser,
            },
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return Response.json({ message: "Failed to update preferences" }, { status: 500 });
    }
}

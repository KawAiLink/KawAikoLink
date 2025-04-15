import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    // Get the current session and user ID
    const session = await getServerSession(authOptions);
    const currentUserId = Number(session?.user?.id);

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract dateEnabled and excludeIds from the request body
    const { dateEnabled, excludeIds = [] } = await req.json();

    // Create an array of IDs to exclude (current user + already seen users)
    const idsToExclude = [currentUserId, ...excludeIds].filter(Boolean);

    console.log(idsToExclude);

    // Fetch one random user matching the filters
    const randomUser = await prisma.user.findFirst({
      where: {
        id: {
          not: {
            in: idsToExclude, // Exclude current user and previously seen users
          },
        },
        dateEnabled: dateEnabled, // Apply the dateEnabled filter
      },
      orderBy: {
        // For better randomness, you might want to use a more sophisticated approach
        // This is a simple approach that will give different results each time
        createdAt: "desc", // Newer users first, can be changed
      },
      take: 1, // Fetch only one user
      select: {
        id: true,
        username: true,
        bio: true,
        avatarUrl: true,
        hobbies: true,
        country: true,
        preferences: {
          select: {
            femboy: true,
            sexualOrientation: true,
          },
        },
      },
    });

    // If no user is found, return a 404 response
    if (!randomUser) {
      return NextResponse.json(
        { message: "No users found matching the criteria" },
        { status: 404 }
      );
    }

    // Log the fetched user for debugging purposes
    console.log(`Fetched user: ${randomUser.username} with ID: ${randomUser.id}`);

    // Return the fetched user
    return NextResponse.json(randomUser);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
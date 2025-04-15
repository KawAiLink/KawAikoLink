import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";


export async function POST(req: NextRequest) {
    try {

        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = Number(session.user.id);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { dateEnabled: true },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Toggle the dateEnabled value
        const newDateEnabled = !user.dateEnabled;

        // Update the user's dateEnabled in the database
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { dateEnabled: newDateEnabled },
            select: { 
                dateEnabled: true,
                // Include any other fields needed for the session
            },
        });

        // Return the updated user data for session update
        return NextResponse.json({ 
            dateEnabled: updatedUser.dateEnabled 
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to toggle dateEnabled" }, { status: 500 });
    }
}
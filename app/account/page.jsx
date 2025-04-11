"use client";

import { signOut, useSession } from "next-auth/react";
import { calculateAge } from "@/utils/calculateAge";

export default function Account() {
    // Fetch the session data
    const { data: session } = useSession();
    const age = calculateAge(session?.user?.dateOfBirth);

    return (
        <>
            <h1>Account Details</h1>

            <div>
                <p><strong>Email:</strong> {session?.user?.email}</p>
                <p><strong>Username:</strong> {session?.user?.username}</p>
                <p><strong>Mobile Number:</strong> {session?.user?.mobileNumber}</p>
                <p><strong>Country:</strong> {session?.user?.country}</p>
                <p><strong>Date of Birth:</strong> {session?.user?.dateOfBirth}</p>
                <p><strong>Age:</strong> {age}</p>
                <p><strong>Bio:</strong> {session?.user?.bio || "Not provided"}</p>
                <p><strong>Avatar URL:</strong> {session?.user?.avatarUrl || "Not provided"}</p>
                <p><strong>Hobbies:</strong> {session?.user?.hobbies?.join(", ") || "Not provided"}</p>
                <p><strong>Femboy Role:</strong> {session?.user?.femboy || "Not provided"}</p>
                <p><strong>Sexual Orientation:</strong> {session?.user?.sexualOrientation || "Not provided"}</p>
            </div>

            <button onClick={() => signOut()}>Logout</button>
        </>
    );
}
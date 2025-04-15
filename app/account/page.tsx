"use client";

import { useSession, signOut } from "next-auth/react";
import { calculateAge } from "@/utils/calculateAge";
import { useEffect, useState } from "react";

export default function Account() {
    const { data: session, status } = useSession();
    const [formattedDateOfBirth, setFormattedDateOfBirth] = useState<string | undefined>(undefined);

    // Calculate age based on dateOfBirth in the session
    const age = calculateAge(session?.user?.dateOfBirth);

    // Format the date of birth if available
    useEffect(() => {
        if (session?.user?.dateOfBirth) {
            const userDateOfBirth = new Date(session.user.dateOfBirth);
            const localeFormattedDate = userDateOfBirth.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
            setFormattedDateOfBirth(localeFormattedDate);
        }
    }, [session?.user?.dateOfBirth]); // Re-run when session dateOfBirth changes

    return (
        <>
            <h1>Account Details</h1>

            <div>
                <p><strong>Email:</strong> {session?.user?.email}</p>
                <p><strong>Username:</strong> {session?.user?.username}</p>
                <p><strong>Mobile Number:</strong> {session?.user?.mobileNumber}</p>
                <p><strong>Country:</strong> {session?.user?.country}</p>
                <p><strong>Date of Birth:</strong> {formattedDateOfBirth || "Loading..."}</p>
                <p><strong>Age:</strong> {age}</p>
                <p><strong>Bio:</strong> {session?.user?.bio || "Not provided"}</p>
                <p><strong>Avatar URL:</strong> {session?.user?.avatarUrl || "Not provided"}</p>
                <p><strong>Hobbies:</strong> {session?.user?.hobbies?.join(", ") || "Not provided"}</p>
                <p><strong>Femboy Role:</strong> {session?.user?.femboy || "Not provided"}</p>
                <p><strong>Sexual Orientation:</strong> {session?.user?.sexualOrientation || "Not provided"}</p>
                <p><strong>Access to Date Mode:</strong> {session?.user?.dateEnabled !== undefined ? session.user.dateEnabled.toString() : "Loading..."}</p>
            </div>

            <button onClick={() => signOut()}>Logout</button>
        </>
    );
}

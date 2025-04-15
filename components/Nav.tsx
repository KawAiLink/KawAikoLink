"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Nav() {
    const { data: session, update } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [dateEnabled, setDateEnabled] = useState(session?.user?.dateEnabled);

    useEffect(() => {
        setDateEnabled(session?.user?.dateEnabled);
    }, [session]);

    const toggleMeetMode = async () => {
        if (isLoading || dateEnabled === undefined) return;

        setIsLoading(true);
        try {
            const res = await fetch("/api/meet/toggle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to toggle meet mode");

            setDateEnabled(data.dateEnabled);
            
            // Only update the dateEnabled in the session, not the rest of the user data
            if (session) {
                await update({
                    ...session,
                    user: {
                        ...session.user,
                        dateEnabled: data.dateEnabled,
                    }
                });
            }

        } catch (err: any) {
            console.error("Toggle failed:", err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <nav className="h-[10vh] md:px-[10vw] px-4 fixed top-0 left-0 w-full flex items-center bg-foreground/50 backdrop-blur-xs backdrop-opacity-85">
            <div className="flex-grow">
                <h1>Logo goes here</h1>
            </div>
            <ul className="flex gap-4">
                <li>
                    <button 
                        onClick={toggleMeetMode} 
                        disabled={isLoading}
                    >
                        {isLoading ? "Updating..." : `Switch to ${dateEnabled ? "Friend" : "Date"} Mode`}
                    </button>
                </li>
                <li>
                    <Link href="/account" className="px-4 py-2 hover:underline">Account</Link>
                </li>
            </ul>
        </nav>
    );
}

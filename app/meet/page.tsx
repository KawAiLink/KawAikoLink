"use client";

import { useState, useEffect } from "react";
import { UserModel } from "@/types/schema/user";
import { fetcher } from "@/utils/fetcher";
import { useSession } from "next-auth/react";

export default function Meet() {
    const { data: session } = useSession();
    const [user, setUser] = useState<UserModel | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [seenUserIds, setSeenUserIds] = useState<number[]>([]);
    const [noMoreUsers, setNoMoreUsers] = useState(false);
    const [isResetting, setIsResetting] = useState(false); // Track reset state

    // Fetch the first user when component mounts
    useEffect(() => {
        if (!session) return;
        if (isResetting) {
            // Reset state variables when resetting
            setNoMoreUsers(false);
            setIsResetting(false);
        }
        fetchNextUser();
    }, [session, isResetting]); // Add `isResetting` as a dependency

    const fetchNextUser = async () => {
        setIsLoading(true);
        setNoMoreUsers(false);

        try {
            const fetchedUser = await fetchMeetUser();

            if (fetchedUser) {
                setUser(fetchedUser);
                setSeenUserIds((prev) => [...prev, fetchedUser.id]);
            } else {
                setUser(null);
                setNoMoreUsers(true);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            setNoMoreUsers(true);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMeetUser = async (): Promise<UserModel | null> => {
        const { data, error } = await fetcher<UserModel>("/api/meet", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                dateEnabled: session?.user?.dateEnabled,
                excludeIds: seenUserIds, // Send the list of already seen users
            }),
        });

        if (error) {
            if (error.status === 404) {
                console.log("No more users found:", error.message);
                return null;
            }
            console.error("Error fetching meet user:", error.message);
            throw new Error(error.message);
        }

        return data;
    };

    const handleLinger = () => {
        fetchNextUser();
    };

    const handleStartOver = () => {
        // Reset seen users and trigger a re-fetch
        setSeenUserIds([]);
        setIsResetting(true); // Trigger the reset effect
    };

    // Render loading state
    if (isLoading) {
        return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
    }

    // Render no user found state
    if (noMoreUsers || !user) {
        return (
            <div className="min-h-screen flex justify-center items-center text-center px-4">
                <div className="max-w-md space-y-4">
                    <h1 className="text-2xl font-semibold">aww... no users left</h1>
                    <p className="text-md text-foreground/70">
                        Please promote our web app to communities to get more matches :3
                    </p>
                    {seenUserIds.length > 0 && (
                        <button onClick={handleStartOver}>
                            Start Over
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Render the fetched user data
    return (
        <main className="flex py-[10vh] md:px-[10vw] px-4 min-h-screen">
            <aside className="md:w-1/6 border flex items-center justify-center">
                <button onClick={handleLinger} className="fixed top-1/2">
                    Linger
                </button>
            </aside>
            <div className="md:w-4/6 border p-4">
                <div className="flex justify-start flex-col space-y-4 w-fit mx-auto">
                    <div className="mx-auto">
                        <img
                            className="max-w-3xs aspect-square rounded-full"
                            src={user.avatarUrl || "https://placehold.co/500/webp"}
                            alt={`${user.username}'s profile`}
                        />
                    </div>

                    <div>
                        <h1 className="text-xl font-medium">{user.username}</h1>
                        <p className="text-sm text-foreground/75">{user.bio || "No bio available."}</p>
                    </div>

                    <div>
                        <h1 className="text-xl">Roles and Gender</h1>
                        <div className="flex gap-4">
                            <div className="rounded-sm border p-1 text-sm text-foreground/75 w-fit">
                                {user.preferences?.femboy || "Not specified"}
                            </div>
                            <div className="rounded-sm border p-1 text-sm text-foreground/75 w-fit">
                                {user.preferences?.sexualOrientation || "Not specified"}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-xl poppins">Hobbies</h1>
                        <div className="flex gap-4 flex-wrap">
                            {user.hobbies?.map((hobby, index) => (
                                <div key={index} className="rounded-sm border p-1 text-sm text-foreground/75 w-fit">
                                    {hobby}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <aside className="md:w-1/6 border flex items-center justify-center">
                <h1 className="fixed top-1/2 md:block hidden">Link</h1>
            </aside>
        </main>
    );
}
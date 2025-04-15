"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Setup() {
    const { data: session, update } = useSession(); 
    const router = useRouter();

    const [formData, setFormData] = useState({
        bio: session?.user?.bio || "",
        avatarUrl: session?.user?.avatarUrl || "",
        hobbies: session?.user?.hobbies?.join(", ") || "",
        femboy: session?.user?.femboy || "IS_ONE",
        sexualOrientation: session?.user?.sexualOrientation || "",
        dateEnabled: session?.user?.dateEnabled || false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const updatedData = {
                ...formData,
                hobbies: formData.hobbies.split(",").map((hobby) => hobby.trim()),
            };

            const response = await fetch("/api/account/setup", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            });

            const result = await response.json();

            if (response.ok) {
                // Update the session with the new data before redirecting
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        bio: updatedData.bio,
                        avatarUrl: updatedData.avatarUrl,
                        hobbies: updatedData.hobbies,
                        femboy: updatedData.femboy,
                        sexualOrientation: updatedData.sexualOrientation,
                        dateEnabled: updatedData.dateEnabled,
                        preferences: {
                            ...session?.user?.preferences,
                            femboy: updatedData.femboy,
                            sexualOrientation: updatedData.sexualOrientation
                        }
                    }
                });
                
                router.push("/account");
            } else {
                alert(result.message || "An error occurred while saving your preferences.");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred while saving your preferences.");
        }
    };

    return (
        <main>
            <h1>Complete Your Profile</h1>
            <form onSubmit={handleSubmit}>
                {/* Bio */}
                <div>
                    <label>Bio</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself..."
                    />
                </div>

                {/* Avatar URL */}
                <div>
                    <label>Avatar URL</label>
                    <input
                        type="url"
                        name="avatarUrl"
                        value={formData.avatarUrl}
                        onChange={handleChange}
                        placeholder="Enter your avatar image URL"
                    />
                </div>

                {/* Hobbies */}
                <div>
                    <label>Interests (comma-separated)</label>
                    <textarea
                        name="hobbies"
                        value={formData.hobbies}
                        onChange={handleChange}
                        placeholder="e.g., Reading, Gaming, Cooking"
                    />
                </div>

                {/* Femboy Role */}
                <div>
                    <label>Femboy Role</label>
                    <select name="femboy" value={formData.femboy} onChange={handleChange}>
                        <option value="IS_ONE">I am a femboy</option>
                        <option value="INTERESTED_IN">I am interested in femboys</option>
                        <option value="BOTH">I am both :3</option>
                    </select>
                </div>

                {/* Sexual Orientation */}
                <div>
                    <label>Sexual Orientation</label>
                    <select name="sexualOrientation" value={formData.sexualOrientation} onChange={handleChange}>
                        <option value="">Prefer not to say</option>
                        <option value="STRAIGHT">Straight</option>
                        <option value="GAY">Gay</option>
                        <option value="BISEXUAL">Bisexual</option>
                        <option value="PANSEXUAL">Pansexual</option>
                        <option value="ASEXUAL">Asexual</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>

                {/* Date Enabled */}
                <div>
                    <label>Date Mode Enabled</label>
                    <input
                        type="checkbox"
                        name="dateEnabled"
                        checked={formData.dateEnabled}
                        onChange={handleChange}
                    />
                </div>

                {/* Submit Button */}
                <button type="submit">Save Preferences</button>
                <button type="button" onClick={() => signOut({ callbackUrl: "/auth/login" })}>
                    Logout
                </button>
            </form>
        </main>
    );
}
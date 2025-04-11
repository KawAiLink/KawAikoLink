"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Setup() {
    const { data: session, update } = useSession();
    const router = useRouter();

    // Initialize state with existing user data or defaults
    const [formData, setFormData] = useState({
        bio: session?.user?.bio || "",
        avatarUrl: session?.user?.avatarUrl || "",
        hobbies: session?.user?.hobbies?.join(", ") || "",
        femboy: session?.user?.femboy || "IS_ONE",
        sexualOrientation: session?.user?.sexualOrientation || "",
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Prepare the updated data
            const updatedData = {
                ...formData,
                hobbies: formData.hobbies.split(",").map((hobby) => hobby.trim()),
            };

            // Send the updated data to the backend API
            const res = await fetch("/api/account/setup", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });

            // Check if the API call was successful
            if (!res.ok) {
                throw new Error("Failed to update preferences.");
            }

            // Parse the response
            const data = await res.json();

            // Update the session with the new data from the API response
            await update(data.user);

            // Redirect to the account page
            router.push("/account");
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

                {/* Submit Button */}
                <button type="submit">Save Preferences</button>
            </form>
        </main>
    );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PhoneInputWithCountry from "@/components/PhoneInputWithCountry";
import { isValidPhoneNumber } from "react-phone-number-input";

export default function Register() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [mobileNumber, setMobileNumber] = useState("+1");
    const [password, setPassword] = useState("");
    const [country, setCountry] = useState("US");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

   
    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }
        return age;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

       
        if (mobileNumber && mobileNumber.length > 3 && !isValidPhoneNumber(mobileNumber)) {
            setError("Please enter a valid phone number.");
            return;
        }

       
        if (!dateOfBirth) {
            setError("Date of birth is required.");
            return;
        }

       
        const age = calculateAge(dateOfBirth);
        if (age < 13) {
            setError("You must be at least 13 years old to register.");
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    username,
                    mobileNumber,
                    password,
                    country,
                    dateOfBirth,
                    age,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push("/auth/login");
            } else {
                setError(data.message || "Registration failed. Please try again.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <>
            <main>
                <div>
                    <h1>Register</h1>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label>Mobile Number</label>
                            <PhoneInputWithCountry
                                mobileNumber={mobileNumber}
                                setMobileNumber={setMobileNumber}
                            />
                        </div>

                        <div>
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!mobileNumber || (mobileNumber.length > 3 && !isValidPhoneNumber(mobileNumber))}
                        >
                            Register
                        </button>
                    </form>
                    <a href="/auth/login">Already have an account? Login</a>
                </div>
            </main>
        </>
    );
}
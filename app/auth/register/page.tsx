"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { firebaseApp } from "@/lib/firebaseAuth";
import PhoneInputWithCountry from "@/components/PhoneInputWithCountry";
import { isValidPhoneNumber } from "react-phone-number-input";
import { calculateAge } from "@/utils/calculateAge";
import { RegisterRequestBody } from "@/types/register/bodyRequest"; // Import the RegisterRequestBody interface

export default function Register() {
    // State variables with proper types
    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [mobileNumber, setMobileNumber] = useState<string>("+1");
    const [password, setPassword] = useState<string>("");
    const [country, setCountry] = useState<string>("US");
    const [dateOfBirth, setDateOfBirth] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [verificationCode, setVerificationCode] = useState<string>("");
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const router = useRouter();
    const auth = getAuth(firebaseApp);

    // Create a ref for the reCAPTCHA container
    const recaptchaContainerRef = useRef<HTMLDivElement | null>(null);

    // Initialize reCAPTCHA verifier only once
    useEffect(() => {
        let recaptchaVerifier: RecaptchaVerifier | undefined;

        if (!recaptchaContainerRef.current) {
            console.error("reCAPTCHA container not found in the DOM.");
            return;
        }

        // Check if reCAPTCHA verifier is already initialized
        if (!window.recaptchaVerifier) {
            recaptchaVerifier = new RecaptchaVerifier(
                auth,
                recaptchaContainerRef.current,
                {
                    size: "normal",
                    callback: () =>
                        console.log("reCAPTCHA verified successfully"),
                    "expired-callback": () =>
                        console.log("reCAPTCHA expired"),
                }
            );

            window.recaptchaVerifier = recaptchaVerifier; // Store globally for reuse
        }

        // Cleanup function to reset reCAPTCHA verifier on unmount
        return () => {
            if (recaptchaVerifier) {
                recaptchaVerifier.clear(); // Clear the reCAPTCHA widget
                delete window.recaptchaVerifier; // Remove global reference
            }
        };
    }, []); // Empty dependency array ensures this runs only once

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate phone number
        if (!isValidPhoneNumber(mobileNumber)) {
            setError("Please enter a valid phone number.");
            return;
        }

        // Validate date of birth
        if (!dateOfBirth) {
            setError("Date of birth is required.");
            return;
        }

        const age = calculateAge(new Date(dateOfBirth));
        if (age < 13) {
            setError("You must be at least 13 years old to register.");
            return;
        }

        try {
            // Ensure reCAPTCHA verifier is initialized
            if (!window.recaptchaVerifier) {
                setError("reCAPTCHA verifier not initialized.");
                return;
            }

            // Send SMS verification code
            const appVerifier = window.recaptchaVerifier;
            const confirmation = await signInWithPhoneNumber(auth, mobileNumber, appVerifier);
            setConfirmationResult(confirmation);
        } catch (err) {
            setError("Failed to send verification code. Please try again.");
            console.error(err);
        }
    };

    // Handle verification code submission
    const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!verificationCode) {
            setError("Please enter the verification code.");
            return;
        }

        try {
            // Confirm the verification code
            if (!confirmationResult) {
                throw new Error("Confirmation result is missing.");
            }

            await confirmationResult.confirm(verificationCode);

            // Prepare the request body
            const requestBody: RegisterRequestBody = {
                email,
                username,
                mobileNumber,
                password,
                dateOfBirth: new Date(dateOfBirth), // Convert string to Date
            };

            // Proceed with registration
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            const data = await res.json();

            if (res.ok) {
                router.push("/auth/login");
            } else {
                setError(data.message || "Registration failed. Please try again.");
            }
        } catch (err) {
            setError("Invalid verification code. Please try again.");
            console.error(err);
        }
    };

    return (
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

                    {/* reCAPTCHA container */}
                    <div ref={recaptchaContainerRef}></div>

                    <button
                        type="submit"
                        disabled={!mobileNumber || !isValidPhoneNumber(mobileNumber)}
                    >
                        Send Verification Code
                    </button>
                </form>

                {confirmationResult && (
                    <form onSubmit={handleVerifyCode}>
                        <div>
                            <label>Verification Code</label>
                            <input
                                type="text"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Verify Code</button>
                    </form>
                )}

                <a href="/auth/login">Already have an account? Login</a>
            </div>
        </main>
    );
}
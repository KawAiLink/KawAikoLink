import { RecaptchaVerifier } from "firebase/auth"; // Import RecaptchaVerifier from firebase/auth

declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier; // Narrowed type for window.recaptchaVerifier
    }
}

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
                callback: () => console.log("reCAPTCHA verified successfully"),
                "expired-callback": () => console.log("reCAPTCHA expired"),
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

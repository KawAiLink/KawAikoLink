
import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut as firebaseSignOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);

export { firebaseApp, auth };

/**
 * Initialize reCAPTCHA verifier for phone authentication.
 * @param {string} containerId - ID of the HTML element where reCAPTCHA will be rendered.
 * @returns {RecaptchaVerifier} - The reCAPTCHA verifier instance.
 */
export const initializeRecaptchaVerifier = (containerId) => {
  return new RecaptchaVerifier(auth, containerId, {
    size: "normal",
    callback: () => {
      console.log("reCAPTCHA verified successfully");
    },
    "expired-callback": () => {
      console.log("reCAPTCHA expired");
    },
  });
};

/**
 * Send an SMS verification code to the provided phone number.
 * @param {string} phoneNumber - The user's phone number in E.164 format (e.g., "+1234567890").
 * @param {RecaptchaVerifier} appVerifier - The reCAPTCHA verifier instance.
 * @returns {ConfirmationResult} - The confirmation result for verifying the SMS code.
 */
export const sendVerificationCode = async (phoneNumber, appVerifier) => {
  try {
    return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  } catch (error) {
    console.error("Error sending verification code:", error);
    throw error;
  }
};

/**
 * Confirm the SMS verification code.
 * @param {ConfirmationResult} confirmationResult - The confirmation result returned by `sendVerificationCode`.
 * @param {string} verificationCode - The SMS verification code entered by the user.
 * @returns {UserCredential} - The authenticated user's credentials.
 */
export const confirmVerificationCode = async (confirmationResult, verificationCode) => {
  try {
    return await confirmationResult.confirm(verificationCode);
  } catch (error) {
    console.error("Error confirming verification code:", error);
    throw error;
  }
};

/**
 * Sign out the currently authenticated user.
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};
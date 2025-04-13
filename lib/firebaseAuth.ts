import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut as firebaseSignOut,
  ConfirmationResult,
  UserCredential,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

export { firebaseApp, auth };

/**
 * Initialize reCAPTCHA verifier for phone authentication.
 */
export const initializeRecaptchaVerifier = (containerId: string): RecaptchaVerifier => {
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
 * Send an SMS verification code.
 */
export const sendVerificationCode = async (
  phoneNumber: string,
  appVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> => {
  try {
    return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  } catch (error) {
    console.error("Error sending verification code:", error);
    throw error;
  }
};

/**
 * Confirm the SMS verification code.
 */
export const confirmVerificationCode = async (
  confirmationResult: ConfirmationResult,
  verificationCode: string
): Promise<UserCredential> => {
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
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

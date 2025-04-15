"use client";

import { SessionProvider, useSession } from "next-auth/react"; // Make sure to import useSession
import { ReactNode } from "react";

interface SessionWrapperProps {
  children: ReactNode;
  session: any;
}

export default function SessionWrapper({ children, session }: SessionWrapperProps) {
  return (
    <SessionProvider session={session}>
      <SessionLoader>{children}</SessionLoader>
    </SessionProvider>
  );
}

function SessionLoader({ children }: { children: ReactNode }) {
  const { status } = useSession(); // Use the useSession hook here

  if (status === "loading") {
    return <p>Loading...</p>; // Global loading state
  }

  return <>{children}</>;
}

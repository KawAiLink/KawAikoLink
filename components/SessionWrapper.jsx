"use client";

import { SessionProvider, useSession } from "next-auth/react";

export default function SessionWrapper({ children }) {
  return (
    <SessionProvider>
      <SessionLoader>{children}</SessionLoader>
    </SessionProvider>
  );
}

function SessionLoader({ children }) {
  const { status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>; // Global loading state
  }

  return <>{children}</>;
}
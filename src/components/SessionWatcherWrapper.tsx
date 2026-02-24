// SessionWatcherWrapper.tsx
"use client";
import { SessionContext } from "@/context/SessionContext";
import { useSession, signOut } from "next-auth/react";
import { ReactNode } from "react";


interface Props {
  children: ReactNode;
}

export default function SessionWatcherWrapper({ children }: Props) {
  const { data: session, status } = useSession();

  // your watcher logic
  if (session?.error === "RefreshAccessTokenError") {
    signOut({ callbackUrl: "/chat-app" });
  }

  return (
    <SessionContext.Provider value={{ session, status }}>
      {children}
    </SessionContext.Provider>
  );
}
// SessionWatcherWrapper.tsx
"use client";
import { SessionContext } from "@/context/SessionContext";
import { useSession, signOut } from "next-auth/react";
import { ReactNode, useMemo } from "react";

interface Props {
  children: ReactNode;
}

export default function SessionWatcherWrapper({ children }: Props) {
  const { data: session, status } = useSession();

  if (session?.error === "RefreshAccessTokenError") {
    signOut({ callbackUrl: "/chat-app" });
  }

  const contextValue = useMemo(() => ({ session, status }), [session, status]);

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}
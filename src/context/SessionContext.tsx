// /app/context/SessionContext.tsx
"use client";
import { createContext, useContext } from "react";
import { Session } from "next-auth";

interface SessionContextType {
  session: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
}

export const SessionContext = createContext<SessionContextType | null>(null);

export const useAppSession = () => {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useAppSession must be used inside SessionProvider");
  return context;
};
"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import SessionWatcherWrapper from "./SessionWatcherWrapper";

interface Props {
  children: ReactNode;
}

export const AuthSessionProvider = ({ children }: Props) => {
  return (
    <SessionProvider basePath="/chat-app/api/auth">
      <SessionWatcherWrapper>{children}</SessionWatcherWrapper>
    </SessionProvider>
  );
};

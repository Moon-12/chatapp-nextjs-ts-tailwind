"use client";
import { redirect } from "next/navigation";
export const getUserSession = (): { session: string } | null => {
  const session = sessionStorage.getItem("SERVER_KEY");
  if (!session) {
    return null;
  }
  return { session };
};

export const clearSession = () => {
  sessionStorage.clear();
  redirect("/");
};

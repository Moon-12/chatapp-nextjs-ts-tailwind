"use client";
export const getUserSession = (): { session: string } | null => {
  const session = sessionStorage.getItem("SERVER_KEY");
  if (!session) {
    return null;
  }
  return { session };
};

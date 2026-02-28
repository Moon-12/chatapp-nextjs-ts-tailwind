import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./authOptions";

export const getUserSession = async () => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
      // redirect throws NEXT_REDIRECT internally
      redirect("/chat-app");
    }

    return {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    };
  } catch (err) {
    // Optional: you can log the error for debugging
    console.error("Session fetch failed:", err);

    // If you want to make sure the user is redirected even if an error happens
    redirect("/chat-app");
  }
};

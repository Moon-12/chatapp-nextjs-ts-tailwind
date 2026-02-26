"use server";

import { redirect } from "next/navigation";
import { getUserSession } from "./getUserSession";

export async function withAuthFetch(
  input: string | URL,
  init: RequestInit = {},
): Promise<Response> {
  let session;
  try {
    session = await getUserSession();
  } catch (err) {
    // If session fetch fails (expired / invalid), redirect immediately
    console.log("err", err);
    redirect("/chat-app");
  }

  if (!session?.accessToken) {
    redirect("/chat-app");
  }
  const { accessToken } = session;

  const headers = new Headers(init.headers || {});
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  headers.set("appKey", process.env.APP_KEY || "");

  const response = await fetch(input, {
    ...init,
    headers,
    cache: init.cache || "no-store",
  });
//   console.log("auth fetch response", response);
  return response;
}

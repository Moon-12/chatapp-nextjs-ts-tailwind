import { Agent } from "undici";
import { getUserSession } from "./getUserSession";
import { redirect } from "next/navigation";

const sseAgent = new Agent({
  headersTimeout: 0, // 🔥 critical
  bodyTimeout: 0,
});

export async function withAuthSseFetch(
  input: RequestInfo,
  init: RequestInit = {},
) {
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

  headers.set("Accept", "text/event-stream");
  headers.set("appKey", process.env.APP_KEY || "");

  return fetch(input, {
    ...init,
    headers,
    cache: "no-store"
  });
}

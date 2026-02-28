import { withAuthFetch } from "@/utils/withAuthFetch";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300; 

export async function GET(req: NextRequest) {
  const groupId = req.nextUrl.searchParams.get("group_id");

  if (!groupId) {
    return new Response("group_id required", { status: 400 });
  }

  // Auth + cookies handled here
  const response = await withAuthFetch(
    `${process.env.BACKEND_CHAT_API_URL}/getLatestMessage?group_id=${groupId}`,
    {
      method: "GET",
    },
  );

  console.log("SSE status:", response.status);
  // Forward backend auth errors prop.erly
  if (!response.ok) {
    return new Response(await response.text(), {
      status: response.status,
    });
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

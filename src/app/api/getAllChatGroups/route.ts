import { withAuthFetch } from "@/utils/withAuthFetch";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await withAuthFetch(
      `${process.env.BACKEND_CHAT_API_URL}/getAllChatGroups`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch groups");
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

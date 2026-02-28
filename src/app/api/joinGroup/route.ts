import { withAuthFetch } from "@/utils/withAuthFetch";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const requestBody = await req.json();
  try {
    const response = await withAuthFetch(
      `${process.env.BACKEND_CHAT_API_URL}/joinGroup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to join groups");
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

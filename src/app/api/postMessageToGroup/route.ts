import { withAuthFetch } from "@/utils/withAuthFetch";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const requestBody = await req.json();
  try {
    const response = await withAuthFetch(
      `${process.env.BACKEND_CHAT_API_URL}/postMessageToGroup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      },
    );

    const result = await response.json();

    console.log("post message",result)
    if (!response.ok) {
      return NextResponse.json(
        { message: result.message },
        { status: response.status },
      );
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

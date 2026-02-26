import { withAuthFetch } from "@/utils/withAuthFetch";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("group_id");

  if (!groupId) {
    return NextResponse.json(
      { message: "group_id is required" },
      { status: 400 },
    );
  }

  try {
    const response = await withAuthFetch(
      `${process.env.BACKEND_CHAT_API_URL}/getAllPreviousMessages?group_id=${groupId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const result = await response.json();
    // console.log("inside api /getAllPreviousMessages", result);

    if (!response.ok) {
      return NextResponse.json(
        { message: result.message },
        { status: response.status },
      );
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

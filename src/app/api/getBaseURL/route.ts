import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { baseurl: process.env.API_BASE_URL },
    { status: 200 }
  );
}

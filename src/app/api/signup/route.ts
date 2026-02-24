import { NextRequest, NextResponse } from "next/server";

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

interface SignupReqBody {
  form: SignupForm;
}

export async function POST(req: NextRequest) {
  try {
    const body: SignupReqBody = await req.json();
    const { name, email, password } = body.form;

    const requestBody = { name, email, password, appKey: process.env.APP_KEY };

    const response = await fetch(`${process.env.SSO_API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();
    console.log("signup",result)
    return NextResponse.json(
      { message: result.message || "Signup successful" },
      { status: response.status },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Signup failed due to server error",
      },
      { status: 500 },
    );
  }
}

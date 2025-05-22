"use server";
export async function login(password: string) {
  if (!password || typeof password !== "string" || password.trim() === "") {
    throw new Error("Password is required");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    }
  );

  const responseData = await response.json();
  if (response.ok) {
    return { isSuccess: true, message: responseData.message };
  }
  throw new Error(responseData.message);
}

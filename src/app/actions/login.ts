"use server";
export async function login(password: string) {
  if (!password || typeof password !== "string" || password.trim() === "") {
    throw new Error("Password is required");
  }

  const response = await fetch(`${process.env.API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": "testchatapp",
    },
    body: JSON.stringify({ password }),
  });

  const responseData = await response.json();
  if (response.ok) {
    return { isSuccess: true, message: responseData.message };
  }
  throw new Error(responseData.message);
}

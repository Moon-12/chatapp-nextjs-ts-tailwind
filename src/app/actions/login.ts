"use server";

export async function login(password: string) {
  if (!password || typeof password !== "string" || password.trim() === "") {
    throw new Error("Password is required");
  }
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const responseData = await response.json();
    if (response.ok) {
      return { isSuccess: true, message: responseData.message };
    }
    throw new Error(
      responseData.message ||
        responseData.error ||
        `Login failed with status ${response.status}`
    );
  } catch (error: unknown) {
    // Handle network errors or other unexpected issues
    if (error instanceof Error) {
      throw new Error(
        error.message || "An unexpected error occurred during login"
      );
    } else {
      throw new Error("An unknown error occurred during login");
    }
  }
}

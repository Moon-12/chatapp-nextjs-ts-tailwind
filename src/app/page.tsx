import Chat from "./components/chat";

async function fetchChats() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/chat`,
      {
        cache: "no-store", // Ensure fresh data
      }
    );
    const data = await response.json();
    if (response.ok && "content" in data) {
      return data.content;
    } else {
      throw new Error("message" in data ? data.message : "Unknown error");
    }
  } catch (err) {
    console.error("Failed to fetch content:", err);
    return ""; // Fallback content
  }
}
export default async function Page() {
  const previousChats = await fetchChats();
  return <Chat previousChats={previousChats} />;
}

import Chat from "./components/chat";

async function fetchChats() {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/getAllPreviousMessages`,
      {
        cache: "no-store", // Ensure fresh data
      }
    );
    const data = await response.json();
    console.log(data);
    if (response.ok && "content" in data) {
      return data.content;
    } else {
      throw new Error("message" in data ? data.message : response.status);
    }
  } catch (err) {
    console.error("Failed to fetch content:", err);
    return ""; // Fallback content
  }
}
export default async function Page() {
  const previousChats = await fetchChats();
  console.log(previousChats);
  return <Chat previousChats={previousChats} />;
}

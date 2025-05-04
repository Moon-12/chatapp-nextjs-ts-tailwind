import Chat from "./components/chat";
import ModalPopup from "./components/modal";

async function fetchChats() {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/getAllPreviousMessages`,
      {
        cache: "no-store", // Ensure fresh data
      }
    );
    const responseData = await response.json();

    if (response.ok) {
      return responseData.data;
    } else {
      throw new Error(
        "message" in responseData ? responseData.message : response.status
      );
    }
  } catch (err) {
    console.error("Failed to fetch content:", err);
    return ""; // Fallback content
  }
}
export default async function Page() {
  const previousChats = await fetchChats();

  return (
    <>
      {" "}
      <ModalPopup />
      <Chat previousChats={previousChats} />
    </>
  );
}

import InitialDataLoader from "@/components/InitialDataLoader";
export default async function Page() {
  const response = await fetch(
    `${process.env.NEXT_API_URL}/chat-app/api/getBaseURL`,
    {
      cache: "no-store", // Ensure fresh data for server-side fetching
    }
  );
  if (!response.ok) {
    const text = await response.text(); // Helpful for debugging
    console.error("Failed API response:", text);
    throw new Error(`Fetch failed with status ${response.status}`);
  }

  const data = await response.json();
  const apiBaseUrl = data.baseurl || "undefined";

  return (
    <>
      <InitialDataLoader url={apiBaseUrl} />
    </>
  );
}

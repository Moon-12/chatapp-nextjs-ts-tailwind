"use server";
export default async function Page() {
  const baseUrl = process.env.API_BASE_URL;
  return (
    <>
      <h1>base url is {baseUrl}</h1>
      <h1>base url is {process.env.SERVER_KEY}</h1>
      {/* <DataComponent url={baseUrl || ""} /> */}
    </>
  );
}

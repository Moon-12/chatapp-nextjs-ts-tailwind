export default async function Page() {
  const baseUrl = process.env.API_BASE_URL;
  return (
    <>
      <h1>base url is {baseUrl}</h1>
      {/* <DataComponent url={baseUrl || ""} /> */}
    </>
  );
}

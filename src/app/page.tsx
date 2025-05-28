import ModalPopup from "../components/modal";
import DataComponent from "../components/InitialDataLoader";

export default async function Page() {
  const baseUrl = await process.env.API_BASE_URL;
  return (
    <>
      <h1>{baseUrl}</h1>
      <DataComponent url={baseUrl || ""} />
    </>
  );
}

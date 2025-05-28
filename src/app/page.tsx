import ModalPopup from "../components/modal";
import DataComponent from "../components/InitialDataLoader";

export default async function Page() {
  const baseUrl = await process.env.API_BASE_URL;
  console.log("base url", baseUrl);
  return (
    <>
      <DataComponent url={baseUrl || ""} />
      <ModalPopup />
    </>
  );
}

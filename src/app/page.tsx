import ModalPopup from "../components/modal";
import DataComponent from "../components/InitialDataLoader";

export default function Page() {
  const baseUrl = process.env.API_BASE_URL;
  console.log("base url", baseUrl);
  return (
    <>
      <DataComponent url={baseUrl || ""} />
      <ModalPopup />
    </>
  );
}

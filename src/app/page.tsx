import ModalPopup from "../components/modal";
import DataComponent from "../components/InitialDataLoader";

export default async function Page() {
  return (
    <>
      <DataComponent url={process.env.API_BASE_URL || ""} />
      <ModalPopup />
    </>
  );
}

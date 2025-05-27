import DataComponent from "../components/InitialDataLoader";
import ModalPopup from "../components/modal";

export default async function Page() {
  console.log("server key", process.env.SERVER_KEY);
  return (
    <>
      {" "}
      <DataComponent
        url={process.env.API_BASE_URL || ""}
        serverKey={process.env.SERVER_KEY || ""}
      />
      <ModalPopup />
    </>
  );
}

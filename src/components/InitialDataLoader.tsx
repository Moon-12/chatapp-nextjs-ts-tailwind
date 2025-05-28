"use client";

import { useEffect } from "react";
import ModalPopup from "./modal";

const InitialDataLoader = ({ url }: { url: string }) => {
  useEffect(() => {
    sessionStorage.setItem("API_BASE_URL", url);
  }, [url]);

  return (
    <>
      <h1>env from public {process.env.NEXT_PUBLIC_TEST_VAR}</h1>
      <ModalPopup />
    </>
  );
};

export default InitialDataLoader;

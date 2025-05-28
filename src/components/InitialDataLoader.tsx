"use client";

import { useEffect } from "react";
import ModalPopup from "./modal";

const InitialDataLoader = ({ url }: { url: string }) => {
  useEffect(() => {
    sessionStorage.setItem("API_BASE_URL", url);
  }, [url]);

  return url && <ModalPopup />;
};

export default InitialDataLoader;

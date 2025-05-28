"use client";

import { useEffect } from "react";

const InitialDataLoader = ({ url }: { url: string }) => {
  useEffect(() => {
    sessionStorage.setItem("API_BASE_URL", url);
  }, [url]);

  return null;
};

export default InitialDataLoader;

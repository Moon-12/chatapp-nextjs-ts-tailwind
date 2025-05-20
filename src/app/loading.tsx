"use client";
import ClipLoader from "react-spinners/ClipLoader";

const LoadingComponent = () => {
  const override = {
    display: "block",
    margin: "100px auto",
  };
  console.log("heer");
  return (
    <ClipLoader
      color="#3b82f6"
      cssOverride={override}
      size={150}
      aria-label="loading-spinner"
    />
  );
};

export default LoadingComponent;

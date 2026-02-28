"use client";
import ClipLoader from "react-spinners/ClipLoader";

const LoadingComponent = () => {
  const override = {
    display: "block",
    margin: "100px auto",
  };
  return (
    <ClipLoader
      color="#006241"
      cssOverride={override}
      size={150}
      aria-label="loading-spinner"
    />
  );
};

export default LoadingComponent;

import React from "react";
import Loader from "react-loader-spinner";
import "./Loader.css";

export default function Header() {
  return (
    <div className="loader">
      <Loader
        type="Audio"
        color="#00BFFF"
        height={100}
        width={100}
        timeout={100000} //3 secs
      />
    </div>
  );
}

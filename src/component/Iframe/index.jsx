import React from "react";

const Iframe = ({ path }) => {
  return (
    <div className="iframe-container">
      <div className="legend absolute z-10 right-[2%] top-[2%] w-[12%]">
        {" "}
        <img src="/images/legendLatest.png" alt="" />
      </div>
      <iframe src={path} title="iframe" style={{ border: "none", width: "100%", height: "100%" }}></iframe>
    </div>
  );
};

export default Iframe;

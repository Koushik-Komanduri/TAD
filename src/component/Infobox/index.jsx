import React from "react";

const InfoBox = ({ title, value, chart, className }) => {
  return (
    <div className={`bg-white border border-[#D9D9D9] rounded-md p-2 py-5 flex flex-col items-center ${className}`}>
      <h3 className="text-gray-800 text-lg font-medium text-center mb-3">{title}</h3>
      <p className="text-2xl text-[#0070CD] font-semibold ">{value}</p>
    </div>
  );
};

export default InfoBox;

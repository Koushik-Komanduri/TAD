import React from "react";

const SubmitButton = ({ onClicked, name }) => {
  return (
    <button
      className="relative text-white bg-[#0070CD] font-semibold rounded-[4px] text-sm px-5 py-2.5 text-center"
      onClick={onClicked}
    >
      {name}
    </button>
  );
};

export default SubmitButton;

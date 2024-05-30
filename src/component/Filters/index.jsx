import React, { useEffect, useRef, useState } from "react";
import { IoChevronDown } from "react-icons/io5";

const Filter = ({ options, name, setSelectedOption, selectedOption, setSelectedOptions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option) => {
    setSelectedOption(option);
    localStorage.setItem("flow", option);
    const selectedOptions = JSON.parse(localStorage.getItem("selectedOptions"));
    if (selectedOptions && selectedOptions.values) {
      // Delete the City array from the selectedOptions object
      delete selectedOptions.values;

      // Save the updated object back to localStorage
      localStorage.setItem("selectedOptions", JSON.stringify(selectedOptions));
    }
    setSelectedOptions(() => {
      const storedOptions = localStorage.getItem("selectedOptions");
      return storedOptions ? JSON.parse(storedOptions) : {};
    });
    setIsOpen(false);
  };

  useEffect(() => {
    setSelectedOption(localStorage.getItem("flow"));
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus(); // Focus on search input when dropdown opens
    }
  }, [isOpen]);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        id="dropdownDefaultButton"
        type="button"
        className="w-full flex justify-between items-center border border-[#D9D9D9] focus:ring-4 focus:outline-none rounded-[4px] text-sm px-2 py-2.5 text-center me-2"
        onClick={toggleDropdown}
      >
        {selectedOption ? selectedOption : name}
        <i className="text-[#6E6E6E] text-xl">
          <IoChevronDown />
        </i>
      </button>
      {isOpen && (
        <div className="w-full absolute z-10 bg-white rounded divide-y divide-gray-100 shadow hover:bg-[#D9D9D9] overflow-y-auto overflow-x-hidden max-h-40">
          {options.map((option) => (
            <button
              key={option}
              className="py-2 px-4 w-full text-left bg-white text-black hover:bg-[#D9D9D9]  "
              onClick={() => { selectOption(option) }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Filter;

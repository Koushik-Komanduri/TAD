import React, { useState, useEffect, useRef } from "react";
import { IoChevronDown } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";

const Dropdown = ({ name, options, onSelect, selectedOptionsFromProps, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    setSelectedOptions(selectedOptionsFromProps || []);
  }, [selectedOptionsFromProps]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setFilteredOptions(options); // Reset filtered options when opening dropdown
    }
  };

  const handleOptionSelect = (option) => {
    if (!selectedOptions.includes(option)) {
      setSelectedOptions([...selectedOptions, option]);
      onSelect(name, [...selectedOptions, option]);
    }
    setSearchTerm("");
  };

  const handleOptionDeselect = (option) => {
    const updatedOptions = selectedOptions.filter((selectedOption) => selectedOption !== option);
    setSelectedOptions(updatedOptions);
    onSelect(name, updatedOptions);
  };

  const handleSearchInputChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filteredOptions = options.filter((option) => option.toLowerCase().includes(searchTerm));
    setFilteredOptions(filteredOptions);
  };

  const handleSelectAll = () => {
    if (selectedOptions.length === options.length) {
      // If all options are already selected, deselect all options
      setSelectedOptions([]);
      onSelect(name, []);
    } else {
      // If not all options are selected, select all options
      setSelectedOptions([...options]);
      onSelect(name, [...options]);
    }
  };

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

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus(); // Focus on search input when dropdown opens
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        id="dropdownDefaultButton"
        type="button"
        className="w-full lg:max-w-md   flex justify-between items-center border border-[#D9D9D9] focus:ring-4 focus:outline-none  font-medium rounded-[4px] text-sm px-2 py-2.5 text-center me-2"
      >
        {selectedOptions.length > 0 ? (
          <div className="flex   space-x-1 flex-wrap over-y-auto max-h-12 gap-y-1 overflow-y-scroll">
            {selectedOptions.map((option) => (
              <span key={option} className="flex  items-center space-x-1  bg-[#D9D9D9] px-1">
                <span className="text-nowrap">{option}</span>
                <div
                  type="button"
                  onClick={() => handleOptionDeselect(option)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none text-[10px] mt-1"
                >
                    <RxCross1 />
                </div>
              </span>
            ))}
          </div>
        ) : (
          <span className="font-normal">{placeholder}</span>
        )}
        <i className="text-[#6E6E6E] text-xl flex items-center" onClick={toggleDropdown}>
          <IoChevronDown />
        </i>
      </button>

      <div
        id="dropdown"
        className={`absolute z-10 ${isOpen ? "" : "hidden"} bg-white divide-y divide-gray-100 rounded-lg shadow w-full`}
      >
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchInputChange}
          className="px-4 py-2 w-full border-b border-gray-200 dark:border-gray-600 focus:outline-none focus:border-blue-500 rounded-ss-md-xl"
        />
        <div className="px-4 py-2 flex items-center bg-white gap-2 border-b border-black ">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-500 cursor-pointer"
            checked={selectedOptions.length === options?.length}
            onChange={handleSelectAll}
          />
          <label className="text-sm text-black ">Select All</label>
        </div>
        <ul
          className=" text-sm text-gray-700 dark:text-gray-200 overflow-y-auto overflow-x-hidden max-h-40"
          aria-labelledby="dropdownDefaultButton"
        >
          {filteredOptions?.sort()?.map((option, index) => (
            <li key={index}>
              <label className="bg-white text-black border-b border-gray flex items-center px-4 py-2 w-full hover:bg-[#D9D9D9] dark:hover:bg-[#D9D9D9] dark:hover:text-white">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-500 cursor-pointer"
                  checked={selectedOptions.includes(option)}
                  onChange={() => {
                    selectedOptions.includes(option) ? handleOptionDeselect(option) : handleOptionSelect(option);
                  }}
                />
                <span className="ml-2 cursor-pointer">{option}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;

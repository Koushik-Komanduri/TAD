import React, { useEffect, useState } from "react";
import Filter from "../Filters";
import Dropdown from "../Dropdown";
import innerfilter from "../../assets/data/graphFilter.json";
import SubmitButton from "../Button";
import axios from "axios";
import useFilterSubmit from "../../hooks/useFilterSubmit";

const CustomFilterContainer = ({
  handleDropdownSelect,
  filterDataProp,
  selectedOptions,
  setSelectedOptions,
  resetFunctions,
  selectedFlowOption,
  setSelectedFlowOption,
  setIframePath,
}) => {
  const [customFilterValues, setCustomFilterValues] = useState([]);
  const [selectedProp, setselectedProp] = useState(null);

  const [filterData, setFilterData] = useState(() => {
    const storedFilterData = localStorage.getItem("FilterData");
    return storedFilterData ? JSON.parse(storedFilterData) : filterDataProp;
  });

  useEffect(() => {
    if (selectedFlowOption) {
      if (selectedFlowOption === "from") {
        setCustomFilterValues(filterData?.From);
        setselectedProp("from");
      } else {
        setCustomFilterValues(filterData?.To);
        setselectedProp("to");
      }
      // handleSubmit(selectProperty);
    }
  }, [selectedFlowOption]);

  const handleSubmit = async () => {
    // Construct request body with selected options
    const requestBody = {
      skills: selectedOptions.Skills || [],
      technologies: selectedOptions.City || [],
      company: selectedOptions.Company || [],
      [selectedFlowOption]: selectedOptions.values,
    };

    try {
      localStorage.setItem("iframePath", "../../network_graph1.html");
      const response = await axios.post(import.meta.env.VITE_PUBLIC_API_URL, requestBody);
      setSearchResult(response.data);
      setIframePath("../../network_graph1.html");
    } catch (error) {
      if (error) {
        console.log(error);
        console.error("Error making API call:", error);
        toast.error("Data not found", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };

  return (
    <>
      <div className="flex items-end flex-col mb-4 sm:mb-0 sm:flex-1 sm:flex mt-5 w-full px-8">
        <div
          style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px" }}
        ></div>
        <div className="w-full gap-4 flex flex-col">
          <div className="flex flex-col w-full gap-4">
            <div>
              <div className="font-semibold mb-1">Select a Resource(s) Flow</div>
              <Filter
                options={innerfilter.data.property}
                name="Select a Property"
                setSelectedOptions={setSelectedOptions}
                setSelectedOption={setSelectedFlowOption}
                selectedOption={selectedFlowOption}
              />
            </div>
            <div>
              <div className="font-semibold mb-1">Select Companies</div>
              <Dropdown
                options={customFilterValues}
                name="values"
                placeholder="Select Values"
                onSelect={handleDropdownSelect}
                selectedOptionsFromProps={selectedOptions["values"]}
              />
            </div>
          </div>
          <div className="flex items-center justify-end ">
            <button
              onClick={resetFunctions}
              class="text-[#0070CD] mr-2 hover:text-white border border-[#0070CD] hover:bg-[#0070CD] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-[4px] text-sm px-5 py-2.5 text-center  dark:border-[#0070CD] dark:text-[#0070CD] dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
            >
              Reset
            </button>
            <div className="h-full flex text-center">
              <SubmitButton onClicked={(e) => handleSubmit(e)} name={"Apply"} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomFilterContainer;

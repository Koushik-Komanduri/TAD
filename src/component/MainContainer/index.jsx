import React, { useEffect, useState, useLayoutEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import Iframe from "../Iframe";
import Dropdown from "../Dropdown";
import SubmitButton from "../Button";
import filter from "../../assets/data/filter.json";
import { IoFilterSharp } from "react-icons/io5";
import CustomFilterContainer from "../CustomFilterContainer";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
import InfoBox from "../Infobox";

const MainContainer = () => {
  const [selectedOptions, setSelectedOptions] = useState(() => {
    const storedOptions = localStorage.getItem("selectedOptions");
    return storedOptions ? JSON.parse(storedOptions) : {};
  });
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [customFilterValues, setCustomFilterValues] = useState();
  const [selectedFlowOption, setSelectedFlowOption] = useState(null);
  const [iframePath, setIframePath] = useState(() => {
    const storedPath = localStorage.getItem("iframePath");
    return storedPath ? storedPath : "../../no_data.html";
  });
  // const [iframePath, setIframePath] = "initial_path"

  const [responseFromStorage, setReponseFromStorage] = useState(() => {
    const storedResponse = localStorage.getItem("response");
    return storedResponse ? JSON.parse(storedResponse) : {};
  });

  const handleDropdownSelect = (name, option) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [name]: option,
    }));
  };

  const callAPI = async ({
    isInitialLoad = false
  } = {}) => {
    // Construct request body with selected options
    const requestBody = {
      skills: isInitialLoad ? ["java, .net"] : (selectedOptions.Skills || []),
      technologies: isInitialLoad ? [] : (selectedOptions.City || []),
      company: isInitialLoad ? [] : (selectedOptions.Company || []),
    };

    
    // Set loading state to true before making the API call
    setLoading(true);

    try {
      // Make API call using Axios
      const response = await axios.post(import.meta.env.VITE_PUBLIC_API_URL, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });



      if (response.status === 500) {
        console.log(response, "this is response");
      }

      setSearchResult(response.data);
      localStorage.setItem("FilterData", JSON.stringify(response.data));
      setCustomFilterValues(response.data);
      setIframePath("../../network_graph.html"); // Set the iframe path after successful API call
      localStorage.setItem("response", JSON.stringify(response.data));
      setReponseFromStorage(JSON.stringify(response.data));
      localStorage.setItem("iframePath", "../../network_graph.html");

      // Debugging: Log the iframePath after setting it
      console.log("Iframe path set to:", "../../network_graph.html");
      if (isInitialLoad) {
        window.location.reload()
      }
    } catch (error) {
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

    setLoading(false);
  }

  const handleSubmit = async () => {
    toast.clearWaitingQueue();

    callAPI()

    // Construct request body with selected options
    // const requestBody = {
    //   skills: selectedOptions.Skills || [],
    //   technologies: selectedOptions.City || [],
    //   company: selectedOptions.Company || [],
    // };

    
    // // Set loading state to true before making the API call
    // setLoading(true);

    // try {
    //   // Make API call using Axios
    //   const response = await axios.post(import.meta.env.VITE_PUBLIC_API_URL, requestBody, {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   });

    //   if (response.status === 500) {
    //     console.log(response, "this is response");
    //   }

    //   setSearchResult(response.data);
    //   localStorage.setItem("FilterData", JSON.stringify(response.data));
    //   setCustomFilterValues(response.data);
    //   setIframePath("../../network_graph.html"); // Set the iframe path after successful API call
    //   localStorage.setItem("iframePath", "../../network_graph.html");
    //   localStorage.setItem("response", JSON.stringify(response.data));

    //   // Debugging: Log the iframePath after setting it
    //   console.log("Iframe path set to:", "../../network_graph.html");
    // } catch (error) {
    //   console.error("Error making API call:", error);
    //   toast.error("Data not found", {
    //     position: "top-right",
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "light",
    //   });
    // }

    // setLoading(false);

  };

    useLayoutEffect(() => {
    const localStorageiframePath = localStorage.getItem("iframePath");
    const localStorageResponse = localStorage.getItem("response");
    const localStorageLoadingCount = localStorage.getItem("appLoadingCount") || 0;

    localStorage.setItem("appLoadingCount", localStorageLoadingCount + 1);

    

    if (
      (
        !localStorageiframePath
      || !localStorageResponse
      ) && localStorageLoadingCount == 0
    ) {
      callAPI({
        isInitialLoad: true
      });
    }
  }, [])

  const handleShowFilters = () => {
    setShowFilters(!showFilters);
  };

  // Store selectedOptions in localStorage
  useEffect(() => {
    localStorage.setItem("selectedOptions", JSON.stringify(selectedOptions));
  }, [selectedOptions]);

  useLayoutEffect(() => {
    const storedResponse = localStorage.getItem("response");
    if (storedResponse) {
      setReponseFromStorage(JSON.parse(storedResponse));
    }
  }, []);

  const handleReset = () => {
    // Retrieve the selectedOptions object from localStorage
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

    localStorage.removeItem("flow");
    setSelectedFlowOption(null);
    setIframePath("../../network_graph.html"); // Reset iframe path to no_data.html
    localStorage.setItem("iframePath", "../../network_graph.html");
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <Navbar />
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <h1 className="text-black text-xl">Loading...</h1>
        </div>
      ) : (
        <div className="mt-[4.5rem] max-w-7xl mx-auto px-4 py-6 sm:px-6">
          <div className="w-full mb-6">
            <h1 className="mb-4 text-xl font-semibold">Talent Summary</h1>
            <div className="w-full lg:w-[75%] flex flex-wrap gap-4">
              <InfoBox
                className="flex-grow min-w-0 sm:flex-1"
                title="No. of Profiles"
                value={responseFromStorage?.total_unique_profiles}
              />
              <InfoBox
                className="flex-grow min-w-0 sm:flex-1"
                title="No. of Locations"
                value={responseFromStorage?.total_unique_locations}
              />
              <InfoBox
                className="flex-grow min-w-0 sm:flex-1"
                title="No. of Skills"
                value={responseFromStorage?.total_unique_skills}
              />
              <InfoBox
                className="flex-grow min-w-0 sm:flex-1"
                title="No. of Companies"
                value={responseFromStorage?.total_unique_companies}
              />
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-between">
              <div className="w-full sm:w-auto mb-4 sm:mb-0 sm:flex-1 sm:flex gap-2 mr-3">
                <div className="d-1 w-full">
                  <div className="mb-2">Skills</div>
                  <Dropdown
                    name={"Skills"}
                    placeholder={"Search..."}
                    options={filter.data.skills}
                    onSelect={handleDropdownSelect}
                    selectedOptionsFromProps={selectedOptions["Skills"]}
                  />
                </div>
                <div className="d-1 w-full">
                  <div className="mb-2">City</div>
                  <Dropdown
                    name={"City"}
                    placeholder={"Search..."}
                    options={filter.data.city}
                    onSelect={handleDropdownSelect}
                    selectedOptionsFromProps={selectedOptions["City"]}
                  />
                </div>
                <div className="d-1 w-full">
                  <div className="mb-2">Company</div>
                  <Dropdown
                    name={"Company"}
                    placeholder={"Search..."}
                    options={filter.data.companies}
                    onSelect={handleDropdownSelect}
                    selectedOptionsFromProps={selectedOptions["Company"]}
                  />
                </div>
                <div className="flex lg:items-center flex-col">
                  <div className="mb-2 text-white">----</div>
                  <SubmitButton onClicked={handleSubmit} name={"Generate"} />
                </div>
              </div>
            </div>
          </div>
          <div className="iframe-containe border border-[#D9D9D9] relative">
            <div className="flex justify-between w-full p-5">
              <span className="font-semibold">Resource Movement Network Graph</span>
              <button className="font-semibold flex items-center gap-2" onClick={handleShowFilters}>
                Advance Filters <IoFilterSharp />
              </button>
            </div>
            <div
              className={`${
                showFilters ? "flex flex-col" : "hidden"
              } justify-end w-[30%] absolute h-full z-20 bg-white right-0`}
            >
              <button
                className="h-10 w-full flex justify-end border-b border-[#D9D9D9] items-center pr-4 text-[#6E6E6E]"
                onClick={handleShowFilters}
              >
                <RxCross1 />
              </button>
              <CustomFilterContainer
                handleDropdownSelect={handleDropdownSelect}
                selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions}
                resetFunctions={handleReset}
                selectedFlowOption={selectedFlowOption}
                setSelectedFlowOption={setSelectedFlowOption}
                setIframeFlowPath={setIframePath}
              />
            </div>
            <Iframe path={iframePath} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainContainer;

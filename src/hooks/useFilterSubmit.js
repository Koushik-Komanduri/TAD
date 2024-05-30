import { useState } from "react";
import axios from "axios";

const useFilterSubmit = () => {
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (selectProperty, customFilterValues) => {
    // Construct request body with selected options
    const requestBody = {
      property: selectProperty,
      values: customFilterValues
    };
l
    // Set loading state to true before making the API call
    setLoading(true);

    // Make API call using Axios
    axios
      .post("http://127.0.0.1:5000/update_graph", requestBody)
      .then((response) => {
        setSearchResult(response.data);
      })
      .catch((error) => {
        console.error("Error making API call", error);
      })
      .finally(() => {
        // Reset loading state after API call is complete
        setLoading(false);
      });
  };

  return { searchResult, loading, handleSubmit };
};

export default useFilterSubmit;

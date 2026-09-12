import { useEffect, useState } from "react";
import XDropdown from "./XDropdown";
const XStates = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://location-selector.labs.crio.do/countries"
        );
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        const result = await response.json();
        setCountries(result);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);
  // Fetch states when country changes
  useEffect(() => {
    if (!selectedCountry) return;
    const fetchStates = async () => {
      try {
        const response = await fetch(
          `https://location-selector.labs.crio.do/country=${selectedCountry}/states`
        );
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        const result = await response.json();
        setStates(result);
      } catch (error) {
        console.error("Error fetching states:", error);
        setError(error.message);
      }
    };
    fetchStates();
  }, [selectedCountry]);
  // Fetch cities when state changes
  useEffect(() => {
    if (!selectedState) return;
    const fetchCities = async () => {
      try {
        const response = await fetch(
          `https://location-selector.labs.crio.do/country=${selectedCountry}/state=${selectedState}/cities`
        );
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        const result = await response.json();
        setCities(result);
      } catch (error) {
        console.error("Error fetching cities:", error);
        setError(error.message);
      }
    };
    fetchCities();
  }, [selectedCountry, selectedState]);
  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    // Reset dependent selections
    setSelectedState("");
    setSelectedCity("");
    setStates([]);
    setCities([]);
    setError("");
  };
  const handleStateChange = (state) => {
    setSelectedState(state);
    // Reset dependent selection
    setSelectedCity("");
    setCities([]);
    setError("");
  };
  const handleCityChange = (city) => {
    setSelectedCity(city);
  };
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }
  return (
    <>
      <div className="flex justify-center items-center">
        <h3 className="text-3xl font-bold">Select Location</h3>
      </div>
      <div className="flex justify-center items-center mt-14 gap-7">
        <XDropdown
          list={countries}
          selectedList={selectedCountry}
          changeList={handleCountryChange}
          title="country"
          disabled={false}
        />
        <XDropdown
          list={states}
          selectedList={selectedState}
          changeList={handleStateChange}
          title="state"
          disabled={!selectedCountry || states.length === 0}
        />
        <XDropdown
          list={cities}
          selectedList={selectedCity}
          changeList={handleCityChange}
          title="city"
          disabled={!selectedState || cities.length === 0}
        />
      </div>
      {selectedCity && (
        <div className="flex justify-center mt-10">
          <p>
            You selected {selectedCity}, {selectedState}, {selectedCountry}
          </p>
        </div>
      )}
    </>
  );
};
export default XStates;
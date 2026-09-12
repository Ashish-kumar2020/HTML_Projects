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

  const [countryError, setCountryError] = useState("");
  const [stateError, setStateError] = useState("");
  const [cityError, setCityError] = useState("");

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setCountryError("");

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
        setCountryError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Fetch states
  useEffect(() => {
    if (!selectedCountry) {
      return;
    }

    const fetchStates = async () => {
      try {
        setStateError("");

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
        setStateError(error.message);
        setStates([]);
      }
    };

    fetchStates();
  }, [selectedCountry]);

  // Fetch cities
  useEffect(() => {
    if (!selectedCountry || !selectedState) {
      return;
    }

    const fetchCities = async () => {
      try {
        setCityError("");

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
        setCityError(error.message);
        setCities([]);
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

    setStateError("");
    setCityError("");
  };

  const handleStateChange = (state) => {
    setSelectedState(state);

    // Reset dependent selection
    setSelectedCity("");

    setCities([]);

    setCityError("");
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="flex justify-center items-center">
        <h3 className="text-3xl font-bold">Select Location</h3>
      </div>

      {countryError && (
        <div className="flex justify-center mt-5">
          <p>{countryError}</p>
        </div>
      )}

      <div className="flex justify-center items-center mt-14 gap-7">
        <XDropdown
          list={countries}
          selectedList={selectedCountry}
          changeList={handleCountryChange}
          title="country"
          disabled={countries.length === 0}
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

      {stateError && (
        <div className="flex justify-center mt-5">
          <p>{stateError}</p>
        </div>
      )}

      {cityError && (
        <div className="flex justify-center mt-5">
          <p>{cityError}</p>
        </div>
      )}

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
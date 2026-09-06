import { useEffect, useState } from "react";
import CountryCard from "./CountryCard";

const Countries = () => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://xcountries-backend.labs.crio.do/all",
        );
        if (!response.ok) {
          throw new Error(`HTTP error : Status : ${response.status}`);
        }
        const result = await response.json();
        console.log(result);
        setCountries(result);
      } catch (error) {
        console.log("Error while fetching countries : ", error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="grid grid-cols-6 gap-8  mt-20">
      {countries.map((country,index) => (
        <CountryCard country={country} key={index} />
      ))}
    </div>
  );
};

export default Countries;

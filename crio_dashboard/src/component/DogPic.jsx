import axios from "axios";
import { useEffect, useState } from "react";

const DogPic = () => {
  const [dogImg, setImg] = useState();
  const [breedName, setBreedName] = useState("random");

  const fetchDogImage = async (breedName) => {
    try {
      const url =
        breedName === "random"
          ? "https://dog.ceo/api/breeds/image/random"
          : `https://dog.ceo/api/breed/${breedName}/images/random`;
      const response = await axios.get(
        url
      );
      console.log(response.data.message);
      setImg(response.data?.message);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDogSearch = (e) => {
    const breed = e.target.value;
    setBreedName(breed);
    fetchDogImage(breed);
  };

  const handleNext = () => {
    fetchDogImage(breedName);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "https://dog.ceo/api/breeds/image/random",
        );
        setImg(response.data?.message);
      } catch (error) {
        console.log("Error while fetching data", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <label htmlFor="dogbreed">Select a breed : </label>
      <select
        name="dogs"
        id="dogbreed"
        value={breedName}
        onChange={handleDogSearch}
      >
        <option value="random">Random</option>
        <option value="beagle">Beagle</option>
        <option value="boxer">Boxer</option>
        <option value="dalmatian">Dalmatian</option>
        <option value="husky">Husky</option>
      </select>
      <div>
        <img src={dogImg} alt="Dog Images" />
      </div>
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default DogPic;

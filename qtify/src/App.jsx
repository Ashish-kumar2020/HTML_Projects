import { useEffect, useState } from "react";
import axios from "axios";

import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Section from "./components/Section/Section";

function App() {
  const [topAlbums, setTopAlbums] = useState([]);
  const [newAlbums, setNewAlbums] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topResponse, newResponse] = await Promise.all([
          axios.get("https://qtify-backend.labs.crio.do/albums/top"),
          axios.get("https://qtify-backend.labs.crio.do/albums/new"),
        ]);

        setTopAlbums(topResponse.data);
        setNewAlbums(newResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar searchData={[...topAlbums, ...newAlbums]} />

      <Hero />

      <Section title="Top Albums" albums={topAlbums} />

      <Section title="New Albums" albums={newAlbums} />
    </>
  );
}

export default App;
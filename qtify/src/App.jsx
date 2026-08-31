import { useEffect, useState } from "react";
import axios from "axios";

import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Section from "./components/Section/Section";

function App() {
  const [topAlbums, setTopAlbums] = useState([]);
  const [newAlbums, setNewAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          topAlbumsResponse,
          newAlbumsResponse,
          songsResponse,
          genresResponse,
        ] = await Promise.all([
          axios.get("https://qtify-backend.labs.crio.do/albums/top"),
          axios.get("https://qtify-backend.labs.crio.do/albums/new"),
          axios.get("https://qtify-backend.labs.crio.do/songs"),
          axios.get("https://qtify-backend.labs.crio.do/genres"),
        ]);

        setTopAlbums(topAlbumsResponse.data);
        setNewAlbums(newAlbumsResponse.data);
        setSongs(songsResponse.data);

        const genresData = genresResponse.data;

        setGenres(
          Array.isArray(genresData)
            ? genresData
            : genresData.data || []
        );
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const searchData = [
    ...topAlbums,
    ...newAlbums,
    ...songs,
  ];

  return (
    <>
      <Navbar searchData={searchData} />

      <Hero />

      <Section
        title="Top Albums"
        data={topAlbums}
        type="album"
      />

      <Section
        title="New Albums"
        data={newAlbums}
        type="album"
      />

      <Section
        title="Songs"
        data={songs}
        genres={genres}
        type="song"
      />
    </>
  );
}

export default App;
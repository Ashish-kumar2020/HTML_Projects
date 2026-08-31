import { useEffect, useState } from "react";
import axios from "axios";

import Card from "../Card/Card";
import styles from "./Section.module.css";

function Section({ title, apiEndpoint }) {
  const [albums, setAlbums] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get(apiEndpoint);
        setAlbums(response.data);
      } catch (error) {
        console.error("Failed to fetch albums:", error);
      }
    };

    fetchAlbums();
  }, [apiEndpoint]);

  const displayedAlbums = showAll ? albums : albums.slice(0, 7);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>{title}</h2>

        <button
          className={styles.toggleButton}
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? "Collapse" : "Show all"}
        </button>
      </div>

      <div className={styles.grid}>
        {displayedAlbums.map((album) => (
          <Card key={album.id} album={album} />
        ))}
      </div>
    </section>
  );
}

export default Section;
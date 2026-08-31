import { useMemo, useState } from "react";
import { Tabs, Tab } from "@mui/material";

import Card from "../Card/Card";
import styles from "./Section.module.css";

function Section({ title, data = [], genres = [], type }) {
  const [showAll, setShowAll] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [startIndex, setStartIndex] = useState(0);

  const filteredData = useMemo(() => {
    if (type !== "song" || selectedGenre === "all") {
      return data;
    }

    return data.filter(
      (song) => song.genre?.key === selectedGenre
    );
  }, [data, selectedGenre, type]);

  const handleGenreChange = (event, newValue) => {
    setSelectedGenre(newValue);
    setStartIndex(0);
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + 1, filteredData.length - 1)
    );
  };

  const handlePrevious = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleShowAll = () => {
    setShowAll((prev) => !prev);
    setStartIndex(0);
  };

  const isAlbum = type === "album";
  const isSong = type === "song";

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>{title}</h2>

        {isAlbum && (
          <button
            className={styles.toggleButton}
            onClick={handleShowAll}
          >
            {showAll ? "Collapse" : "Show all"}
          </button>
        )}
      </div>

      {isSong && (
        <Tabs
          value={selectedGenre}
          onChange={handleGenreChange}
          className={styles.tabs}
        >
          <Tab
            label="All"
            value="all"
            className={styles.tab}
          />

          {Array.isArray(genres) &&
            genres.map((genre) => (
              <Tab
                key={genre.key}
                label={genre.label}
                value={genre.key}
                className={styles.tab}
              />
            ))}
        </Tabs>
      )}

      {isAlbum && showAll ? (
        <div className={styles.grid}>
          {data.map((item) => (
            <Card
              key={item.id}
              item={item}
              type={type}
            />
          ))}
        </div>
      ) : (
        <div className={styles.carouselWrapper}>
          {startIndex > 0 && (
            <button
              className={`${styles.carouselButton} ${styles.leftButton}`}
              onClick={handlePrevious}
              aria-label="Previous"
            >
              ‹
            </button>
          )}

          <div className={styles.carouselViewport}>
            <div
              className={styles.carouselTrack}
              style={{
                transform: `translateX(-${startIndex * 179}px)`,
              }}
            >
              {filteredData.map((item) => (
                <Card
                  key={item.id}
                  item={item}
                  type={type}
                />
              ))}
            </div>
          </div>

          {startIndex < filteredData.length - 1 && (
            <button
              className={`${styles.carouselButton} ${styles.rightButton}`}
              onClick={handleNext}
              aria-label="Next"
            >
              ›
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default Section;
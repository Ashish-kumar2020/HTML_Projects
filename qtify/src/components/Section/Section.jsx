import { useState } from "react";
import Card from "../Card/Card";
import styles from "./Section.module.css";

function Section({ title, albums }) {
  const [showAll, setShowAll] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const cardsToShow = 6;

  const handleNext = () => {
    if (startIndex + cardsToShow < albums.length) {
      setStartIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 1);
    }
  };

  const visibleAlbums = albums.slice(
    startIndex,
    startIndex + cardsToShow
  );

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

      {showAll ? (
        <div className={styles.grid}>
          {albums.map((album) => (
            <Card key={album.id} album={album} />
          ))}
        </div>
      ) : (
        <div className={styles.carouselWrapper}>
          {startIndex > 0 && (
            <button
              className={`${styles.carouselButton} ${styles.leftButton}`}
              onClick={handlePrevious}
              aria-label="Previous albums"
            >
              ‹
            </button>
          )}

          <div className={styles.carousel}>
            {visibleAlbums.map((album) => (
              <Card key={album.id} album={album} />
            ))}
          </div>

          {startIndex + cardsToShow < albums.length && (
            <button
              className={`${styles.carouselButton} ${styles.rightButton}`}
              onClick={handleNext}
              aria-label="Next albums"
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
import { useState } from "react";
import Card from "../Card/Card";
import styles from "./Section.module.css";

function Section({ title, albums }) {
  const [showAll, setShowAll] = useState(false);

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
        {albums.map((album) => (
          <Card key={album.id} album={album} />
        ))}
      </div>
    </section>
  );
}

export default Section;
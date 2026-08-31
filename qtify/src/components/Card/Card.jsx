import { Chip } from "@mui/material";
import styles from "./Card.module.css";

function Card({ item, type }) {
  const chipText =
    type === "song"
      ? `${item.likes} Likes`
      : `${item.follows} Follows`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <img
          src={item.image}
          alt={item.title}
          className={styles.image}
        />

        <div className={styles.bottomSection}>
          <Chip
            label={chipText}
            size="small"
            className={styles.chip}
          />
        </div>
      </div>

      <p className={styles.title}>{item.title}</p>
    </div>
  );
}

export default Card;
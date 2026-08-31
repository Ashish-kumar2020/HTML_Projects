import { Card as MuiCard, Chip } from "@mui/material";
import styles from "./Card.module.css";

function Card({ album }) {
  return (
    <div className={styles.wrapper}>
      <MuiCard className={styles.card}>
        <img
          src={album.image}
          alt={album.title}
          className={styles.image}
        />

        <div className={styles.bottomSection}>
          <Chip
            label={`${album.follows} Follows`}
            size="small"
            className={styles.chip}
          />
        </div>
      </MuiCard>

      <p className={styles.title}>{album.title}</p>
    </div>
  );
}

export default Card;
import styles from "./Hero.module.css";
import headphone from "../../assets/hero_headphones.png";

function Hero() {
  return (
    <section className={styles.hero}>
      <div>
        <h1>100 Thousand Songs, ad-free</h1>
        <h1>Over thousands podcast episodes</h1>
      </div>

      <div>
        <img src={headphone} alt="headphones" />
      </div>
    </section>
  );
}

export default Hero;
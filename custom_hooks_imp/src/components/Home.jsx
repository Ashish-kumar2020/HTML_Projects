import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";


function Home(){
    const {theme , toggleTheme} = useContext(ThemeContext);
    return (
        <>
        <h1>Home</h1>
        <button onClick={toggleTheme}>Current Theme : {theme}</button>
        </>

    )
}

export default Home;
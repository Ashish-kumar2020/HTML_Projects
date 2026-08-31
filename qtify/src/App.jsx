import "./App.css";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Section from "./components/Section/Section";

function App() {
  return (
    <>
      <Navbar searchData={[]} />

      <Hero />

      <Section
        title="Top Albums"
        apiEndpoint="https://qtify-backend.labs.crio.do/albums/top"
      />

      <Section
        title="New Albums"
        apiEndpoint="https://qtify-backend.labs.crio.do/albums/new"
      />
    </>
  );
}

export default App;
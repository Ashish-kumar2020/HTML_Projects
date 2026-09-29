import "./App.css";
import { lazy, Suspense } from "react";
const Dashboard = lazy(() => import("./components/Dashboard"));
const Settings = lazy(() => import("./components/Settings"));

function App() {
  return (
    <>
      <h1>Optinization</h1>
      <Suspense fallback={<p>Loading.....</p>}>
        <Dashboard />
        <Settings />
      </Suspense>
    </>
  );
}

export default App;

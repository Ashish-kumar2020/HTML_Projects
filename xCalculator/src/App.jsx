import { useState } from "react";
import "./App.css";

const buttons = [
  "7",
  "8",
  "9",
  "+",
  "4",
  "5",
  "6",
  "-",
  "1",
  "2",
  "3",
  "*",
  "C",
  "0",
  "=",
  "/",
];

function App() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");

  const handleClick = (value) => {
    if (value === "C") {
      setExpression("");
      setResult("");
      return;
    }

    if (value === "=") {
      if (!expression) {
        setResult("Error");
        return;
      }

      try {
        if (!/^[0-9+\-*/.]+$/.test(expression)) {
          setResult("Error");
          return;
        }

        const calculatedResult = Function(
          `"use strict"; return (${expression})`,
        )();

        setResult(String(calculatedResult));
      } catch {
        setResult("Error");
      }

      return;
    }

    setExpression((prev) => prev + value);
  };

  return (
    <div className="calculator">
      <h1>React Calculator</h1>

      <input type="text" value={expression} readOnly />

      <div className="result">{result}</div>

      <div className="buttons">
        {buttons.map((button) => (
          <button
            key={button}
            type="button"
            onClick={() => handleClick(button)}
          >
            {button}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;

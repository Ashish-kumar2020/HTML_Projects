import { useState } from "react";

const XCounter = () => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const handleDecrement = () => {
    setCount((prevCount) => prevCount - 1);
  };

  return (
    <div>
      <h1>Counter App</h1>

      <p>Count: {count}</p>

      <button type="button" onClick={handleIncrement}>
        Increment
      </button>

      <button type="button" onClick={handleDecrement}>
        Decrement
      </button>
    </div>
  );
};

export default XCounter;
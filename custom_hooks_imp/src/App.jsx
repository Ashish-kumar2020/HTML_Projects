// import Home from "./components/Home";
// import useFetch from "./hooks/useFetch";

import { useCallback, useMemo, useState } from "react";
import Child from "./components/Child";


export default function App() {

  const [count,setCount] = useState(0);
  const [number,setNumber] = useState(100);

  // const {isLoading, data, error} = useFetch("https://jsonplaceholder.typicode.com/users");

  // if(isLoading){
  //   return <h1>Loading....</h1>
  // }
  // if(error){
  //   return <h1>{error}</h1>
  // }
  
  const handleClick = useCallback(() => {
    console.log("Child Clicked")
  },[]);

  const expensiveCalucaltion = (num)=> {
    console.log("Calculating....");
    return num * 100;
  }

  const result = useMemo(() => {
    return expensiveCalucaltion(number);
  },[number])

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      {/* {
        data.map((val) => {
          return <h1 key={val.id}>{val.username}</h1>
        })
      } */}

      {/* <Home/> */}



      {/* React.memo + useCallback*/}
      <button onClick={() => setCount((prev) => prev + 1)}>
        {count}
      </button>
       <button onClick={() => setNumber((prev) => prev + 1)}>
        {number}
      </button>
      {result}
      <Child onClick={handleClick}/>
    </div>
  );
}

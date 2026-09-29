import React from "react";


const Child = React.memo(({onClick}) =>{
    console.log("Child Re-rendered")
    return <>
        <button onClick={onClick}>Click Child</button>
    </>
})

export default Child;
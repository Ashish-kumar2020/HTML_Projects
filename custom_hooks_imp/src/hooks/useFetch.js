import { useEffect, useState } from "react";



function useFetch(url){
    const [isLoading,setIsLoading] = useState(false);
    const [data,setData] = useState([]);
    const [error,setError] = useState(null);


    useEffect(() => {

        const controller = new AbortController();

        async function fetchApiData(){
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch(url, {
                    signal:  controller.signal
                });
                if(!response.ok){
                    throw new Error("There was an issue while fetching the api data");
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                if(error.name !== 'AbortError'){
                    setError("Api Request was cancelled");
                }
            }finally{
                setIsLoading(false);
            }
        }

        fetchApiData();

        return ()=>{
            controller.abort();
        } 


    },[url]);

    return {
        isLoading,
        data,
        error
    }
}

export default useFetch;
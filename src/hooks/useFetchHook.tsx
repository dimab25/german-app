"use client"
import { useEffect, useState } from "react";

type HookReturnType<T>={
    data: T|null;
};

function useFetchHook<T>(url:string):HookReturnType<T> {
const [data, setData] = useState<T|null>(null);

useEffect(() => {
 const fetchData =async ()=>{
    const response = await fetch(url);
    const result = (await response.json())as T;
       setData(result);
 }
fetchData();
}, [url])


  return {data:data
}
}

export default useFetchHook;
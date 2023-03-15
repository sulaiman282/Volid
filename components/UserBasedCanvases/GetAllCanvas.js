import React, { useState, useEffect } from "react";
import CanvasCard from "./CanvasCard";
import { useRouter } from 'next/router';


 

import { useCookies } from "react-cookie";
export default function GetAllCanvas({ data }) {
  const [cookie, setCookie, removeCookie] = useCookies(["user"]);
  const [userData, setUserData] = useState(cookie?.user);
  const [count, setCount] = useState(10);
  const router = useRouter();
  const { slug } = router.query;
  // console.log("data from server side ", data);
  useEffect(() => {
    setUserData(cookie?.user);
  }, [cookie, setUserData]);

  return (
    <div className="container-sk   py-5 flex flex-col lg:gap-8 gap-4">
  
<h1 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold font-display"><span className="bg-primary px-3 rounded-full text-white">{slug}</span></h1>
  
      {data?.map((item, index) => (
        <div key={index}>{index <= count && <CanvasCard item={item} />}</div>
      ))}

      {count <= data?.length && (
        <div className="flex justify-center">
          <button
            onClick={() => {
              setCount(count + 10);
            }}
            className="bg-primary hover:bg-primary2 duration-300 px-3 py-3 mb-5 rounded-md lg:text-lg md:text-base text-md text-white font-bold w-fit"
          >
            Load&nbsp;More
          </button>
        </div>
      )}
    </div>
  );
}

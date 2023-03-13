import React, { useState, useEffect } from "react";
import CanvasCard from "./CanvasCard";
import SearchBox from "./SearchBox";
import CreateCanvas from "./CreateCanvas";
import { useCookies } from "react-cookie";
export default function GetAllCanvas({ data }) {
  const [cookie, setCookie, removeCookie] = useCookies(["user"]);
  const [userData, setUserData] = useState(cookie?.user);
  const [count, setCount] = useState(10);


  // console.log("data from server side ", data);
  useEffect(() => {
    setUserData(cookie?.user);
  }, [cookie, setUserData]);

  
  return (
    <div className="container-sk lg:py-20 md:py-10 py-5 flex flex-col gap-4">
      <SearchBox />

      {userData?.token && <CreateCanvas token={userData?.token} />}
      {data?.map((item, index) => (

      
        <div key={index}>
         {index <= count && (
 <CanvasCard item={item} />

         )}
         
        </div>
      ))}

      {count <= data.length && (
        <div className="flex justify-center"><button onClick={()=>{setCount(count+10)}} className="bg-primary hover:bg-primary2 duration-300 px-3 py-3 rounded-md lg:text-lg md:text-base text-md text-white font-bold w-fit">Load&nbsp;More</button></div>
      )}
    </div>
  );
}

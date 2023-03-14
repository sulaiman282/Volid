import React,{useState} from "react";

import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

export default function SearchBox() {
  const [text, setText] = useState("");

 
  return (
    <div className="relative mb-5 flex justify-end">
      <input
        
        
        type="text"
        onChange={(e)=>{setText(e.target.value)}}
        placeholder="Enter canvas name to Search"
        className="focus:outline-none border w-full md:w-2/3 lg:w-1/2 border-primary text-black  px-3  py-3 lg:py-5 placeholder-black rounded-xl"
      />
        <Link
                href={{
                  pathname: "/",
                  query: {
                    owner: text,
                  
                  },
                }}
              >
<button   className="lg:text-lg md:text-base text-md absolute top-1/2 right-0 -translate-y-1/2 mr-4 hover:shadow-lg duration-300 bg-blue-700  text-white hover:bg-blue-900 h-4/5 border px-3 rounded-lg">Search</button>

              </Link>
      
    </div>
  );
}

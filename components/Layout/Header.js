import React, { useState,useEffect } from "react";
import Link from "next/link";
import { useCookies } from "react-cookie";
import axios from "axios";
export default function Header() {
  const [cookie, setCookie, removeCookie] = useCookies(["user"]);
  const [userData, setUserData] = useState(cookie?.user);
  
  const Logoutfun=()=>{
    removeCookie("user", { path: "/" });
    setUserData(null);
  }
  
  useEffect(() => {
    setUserData(cookie?.user);
  }, [cookie, setUserData]);



  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/user/`, {
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          Authorization: `Token ${userData?.token}`,
        },
      })
      .then((response) => {
        // console.log(response);
      

        const { status, data } = response;
        if (status === 200) {
          setCookie("user", data?.user, {
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 1 week
          });
       
        } else {
          removeCookie("user", { path: "/" });
    setUserData(null);
        }
      })
      .catch((error) => {
        removeCookie("user", { path: "/" });
    setUserData(null);
      });
  }, []);





  return (
    <>
 
      <div className="md:h-20  h-16 bg-primary border-b border-white"  >
      <div className="container-sk flex items-center h-full p-2 justify-between">
        <Link href="/" className="hover:text-red-700 duration-300 text-white">
          <h1 className="font-display lg:text-5xl md:text-4xl text-3xl font-bold ">
            Volit
          </h1>
        </Link>

        <div className="relative ">
          <div className="h-12 w-12 lg:h-16 lg:w-16 rounded-full overflow-hidden    group">
            <img
              alt="profile"
              src={
                userData?.image
                  ? cookie.user.image
                  : "https://i.ibb.co/bv7wNmY/22-223978-transparent-no-avatar-png-pyrenees-png-download.jpg"
              }
              className="h-full w-full object-cover cursor-pointer"
            />

            <div className="   absolute bottom-0 translate-y-full left-0 -translate-x-full lg:ml-16 ml-12  z-40 group-hover:block hidden">
              <div className="mt-3 bg-white border shadow-lg rounded p-5 flex flex-col gap-3 " >
              
              {userData?.token  && (
                <Link href="/profile">
                <p className=" hover:text-red-700 duration-300">My&nbsp;Profile</p>
              </Link>  )}
              {userData?.token  && (
                <Link href={`/canvas/user/${userData?.username}  `}>
                <p className=" hover:text-red-700 duration-300">My&nbsp;Canvases</p>
              </Link>  )}
              {userData?.token  && (
                <p className=" hover:text-red-700 duration-300 cursor-pointer"  onClick={()=>Logoutfun()}>Logout</p>  )}

                {!userData?.token  && (
                  <Link href="/login">
                    <p className=" hover:text-red-700 duration-300">Login</p>
                  </Link>
                )}

                {!userData?.token  && (
                  <Link href="/register">
                    <p className=" hover:text-red-700 duration-300">Register</p>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    </>
  );
}

import Link from "next/link";
import React from "react";

export default function CanvasCard({item}) {
  return (
    <div className="border shadow-lg bg-primary lg:px-10 px-5 py-5 rounded-lg text-white w-full">
      <div className="flex items-center gap-4">
        <div className="">
          <img
            alt="profile"
            src={item?.creator?.image || "https://i.ibb.co/bv7wNmY/22-223978-transparent-no-avatar-png-pyrenees-png-download.jpg"}
            className="lg:h-20 lg:w-20 w-12 h-12  object-cover cursor-pointer rounded-full"
          />
        </div>

        <div>
          <p className="text-md md:text-base lg:text-lg font-semibold">
            {item?.creator?.username}
          </p>
          <p className="text-sm md:text-md lg:text-base">{item?.created_at.substring(0, 10)}</p>
        </div>
      </div>
      <h2 className="font-bold lg:text-2xl md:text-xl text-lg lg:ml-24 ml-16 mt-5">{item?.name}</h2>
      <h3 className=" lg:text-lg md:text-base text-md lg:ml-24 ml-16 mt-5">{item?.description}</h3>
      <div className="flex justify-end">
      <Link
          href={{
            pathname: "/canvas/[slug]",
            query: { slug: item?.name },
          }}
        className="text-right border-2 hover:bg-primary2 duration-300 px-3 py-2 font-display lg:text-xl md:text-lg text-base mt-3">Read More</Link>
      </div>
    </div>
  );
}

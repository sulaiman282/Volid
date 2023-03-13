import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { Formik } from "formik";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import axios from "axios";

export default function ChoiceList() {
  const router = useRouter();
  const [choiceList, setChoiceList] = useState(null);

  const { slug } = router.query;

  const [cookie, setCookie, removeCookie] = useCookies(["user"]);
  const [userData, setUserData] = useState(cookie?.user);

  useEffect(() => {
    setUserData(cookie?.user);
  }, [cookie, setUserData]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/canvasses/${slug}/choices/`, {})
      .then((res) => {
        setChoiceList(res?.data?.choices);
      })
      .catch((error) => {
        // console.log("Fetching Error", error);
      });
  }, []);

  return (
    <div className="my-5 flex flex-col gap-4">
      {choiceList?.map((item, index) => (
        <div key={index} className="border rounded-md ">
          <div className="px-5 py-10">
            <Inputfield item={item} userData={userData} slug={slug} />
          </div>
          <div className="bg-primary/10 p-5 flex justify-between items-center gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="">
                <img
                  alt="profile"
                  src={
                    item?.user?.image ||
                    "https://i.ibb.co/bv7wNmY/22-223978-transparent-no-avatar-png-pyrenees-png-download.jpg"
                  }
                  className=" w-12 h-12  object-cover cursor-pointer rounded-full"
                />
              </div>

              <div>
                <p className="text-md md:text-base lg:text-lg font-semibold">
                  {item?.user?.username}
                </p>
                <p className="text-sm md:text-md lg:text-base">
                  {item?.created_at.substring(0, 10)}
                </p>
              </div>
            </div>
            <button className="bg-primary text-white hover:bg-primary2 hover:shadow-lg px-3 py-2 font-sans lg:text-lg md:text-base text-md rounded-md duration-300">
              Donate Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const Inputfield = ({ item, userData, slug }) => {
  const [editChoice, setEditChoice] = useState(false);
  const [text1, setText1] = useState(item?.text);

  const router = useRouter();

  const UpdateChoice = async () => {
    const loading = toast.loading("Please wait a moment ...");
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/canvasses/${slug}/choices/${item?.id}`,
        {
          choice: {
            text: text1,
          },
        },

        {
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            Authorization: `Token ${userData?.token}`,
          },
        }
      );
      const { status, data } = res;
      // console.log(res);

      if (status === 200) {
        toast.dismiss(loading);

        toast.success("Choice Created Successfully !");
        router.reload();

        setText1("");
      } else {
        toast.dismiss(loading);
        toast.error("Please check your data.");
      }
    } catch (error) {
      // console.log(error);
      const { status } = error?.response;
      toast.dismiss(loading);

      if (status === 0) {
        toast.error("Network error. Please check your internet connection.");
      } else if (status === 400) {
        toast.error("Validation error. Please check your input.");
      } else if (status === 401) {
        toast.error("Unauthorized error. Please log in first.");
      } else {
        toast.error("Server error. Please try again later.");
      }
    }
  };

  return (
    <>
      {!editChoice ? (
        <p>{item?.text}</p>
      ) : (
        <>
          <textarea
            id="w3review"
            rows="2"
            name="description"
            maxLength="160"
            defaultValue={item?.text}
            onChange={(e) => setText1(e.target.value)}
            className="w-full focus:outline-none focus:border-2 border rounded-md border-gray-700 mt-5 px-3  py-2"
            placeholder="Enter Descriotion Here"
          />

          <div className="flex gap-4 mt-5">
            <button
              className="px-3 py-2 border rounded-lg hover:bg-gray-100 duration-300 hover:shadow-lg "
              onClick={() => {
                setEditChoice(false);
              }}
            >
              Cancel
            </button>
            <button
              className="px-3 py-2 border rounded-lg hover:bg-gray-100 duration-300 hover:shadow-lg "
              onClick={() => {
                UpdateChoice();
              }}
            >
              Save
            </button>
          </div>
        </>
      )}
      {editChoice !== true && (
        <p className="text-end mt-3">
          <i
            className="fa-solid fa-pen-to-square hover:text-red-700 cursor-pointer"
            onClick={() => {
              setEditChoice(true);
            }}
          ></i>
        </p>
      )}
    </>
  );
};

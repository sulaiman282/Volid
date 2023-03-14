import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { Formik } from "formik";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import axios from "axios";

export default function CreateChoice({ data }) {
  const [text1, setText1] = useState("");
  const testData = data;
  const [loading, setLoading] = useState(false);
  const [cookie, setCookie, removeCookie] = useCookies(["user"]);
  const [userData, setUserData] = useState(cookie?.user);
  const router = useRouter();

  useEffect(() => {
    setUserData(cookie?.user);
  }, [cookie, setUserData]);

  const CreateChoice = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/canvasses/${testData?.name}/choices/`,
        {
          choice: {
            text: text1,
            canvass: testData?.id,
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
      setLoading(false);
      if (status === 201) {
        toast.dismiss(loading);

        toast.success("Choice Created Successfully !");
        router.reload();

        setText1("");
      } else {
        toast.dismiss(loading);
        toast.error("Canvas Name Already Exists.");
      }
    } catch (error) {
      // console.log(error);
      const { status } = error?.response;
      setLoading(false);
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
    <div className="mt-5 bg-[#ECECED]  ">
      <textarea
        id="w3review"
        rows="5"
        name="description"
        maxLength="160"
        value={text1}
        onChange={(e) => setText1(e.target.value)}
        className="w-full focus:outline-none focus:border-none border-none rounded-md border-gray-700 p-5"
        placeholder="Enter description about choice"
      />
      <div className="flex justify-end  p-5">
        <button
          onClick={() => CreateChoice()}
          className="bg-blue-700 text-white hover:bg-blue-900 px-3 py-2 rounded-lg duration-300 lg:text-xl md:text-lg text-base font-bold font-display "
        >
          Post Choice
        </button>
      </div>
    </div>
  );
}

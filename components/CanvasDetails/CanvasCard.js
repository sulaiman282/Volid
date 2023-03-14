import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { Formik } from "formik";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import axios from "axios";

export default function CanvasCard({ data }) {
  const [cookie, setCookie, removeCookie] = useCookies(["user"]);
  const [userData, setUserData] = useState(cookie?.user);

  const [edit, setEdit] = useState(false);

  const testData = data;
  useEffect(() => {
    setUserData(cookie?.user);
  }, [cookie, setUserData]);

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // console.log("Data", data);


const DeleteCanvas=async()=>{
  setLoading(true);
  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/canvasses/${testData?.name}/`,{"_method":"delete"},
     
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
    if (status === 200) {
      toast.dismiss(loading);

      toast.success("Canvas updated successfully!");
      const slug = testData?.name;
      router.push(`/`);
      setEdit(false);
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

}












  const CreateCanvasFunction = async (values) => {
    // console.log(values);
    setLoading(true);
    const { name, description } = values;
    const loading = toast.loading("Please wait a moment...");

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/canvasses/${testData?.name}/`,
        {
          canvass: {
            name: name,
            description: description,
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
      if (status === 200) {
        toast.dismiss(loading);

        toast.success("Canvas updated successfully!");
        const slug = name;
        router.push(`/canvas/${slug}`);
        setEdit(false);
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
    <>
      {!edit ? (
        <div className="border shadow-lg bg-primary lg:px-10 px-5 py-5 rounded-lg text-white w-full">
          <div className="flex justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="">
                <img
                  alt="profile"
                  src={
                    data?.creator?.image ||
                    "https://i.ibb.co/bv7wNmY/22-223978-transparent-no-avatar-png-pyrenees-png-download.jpg"
                  }
                  className="lg:h-20 lg:w-20 w-12 h-12  object-cover cursor-pointer rounded-full"
                />
              </div>

              <div>
                <p className="text-md md:text-base lg:text-lg font-semibold">
                  {data?.creator?.username}
                </p>
                <p className="text-sm md:text-md lg:text-base">
                  {data?.created_at.substring(0, 10)}
                </p>
              </div>
            </div>
            {userData?.username == data?.owner?.username && (
              <div className="flex flex-col gap-3">

<i
                className="fa-solid fa-pen-to-square cursor-pointer hover:text-red-700 duration-300 lg:text-lg md:text-base text-md"
                onClick={() => setEdit(true)}
              />
              {/* <i onClick={()=>DeleteCanvas()} class="fa-solid fa-trash cursor-pointer hover:text-red-700 duration-300 lg:text-lg md:text-base text-md"/> */}
              </div>
            )}
          </div>

          <h2 className=" break-words font-bold lg:text-2xl md:text-xl text-lg lg:ml-24 ml-16 mt-5">
            {data?.name}
          </h2>
          <h3 className=" break-words lg:text-lg md:text-base text-md lg:ml-24 ml-16 mt-5">
            {data?.description}
          </h3>
        </div>
      ) : (
        <div className="border-2 lg:p-10 p-5 mb-5 rounded-md bg-primary">
          <h5 className="font-display lg:text-3xl  md:text-2xl text-xl font-bold text-white text-center">
            Edit Canvas
          </h5>

          <Formik
            initialValues={{ name: data?.name, description: data?.description }}
            validate={(values) => {
              const errors = {};

              if (!values.name) {
                errors.name = "Required";
              }
              if (!values.description) {
                errors.description = "Required";
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              CreateCanvasFunction(values);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              /* and other goodies */
            }) => (
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  placeholder="Enter Canvas Name"
                  className="focus:outline-none focus:border-2 border rounded-md border-gray-700 mt-5 px-3  py-2 w-full"
                />
                <div className="my-2 text-xs text-red-700">{errors.name}</div>
                <textarea
                  id="w3review"
                  rows="5"
                  name="description"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.description}
                  className="w-full focus:outline-none focus:border-2 border rounded-md border-gray-700 mt-5 px-3  py-2"
                  placeholder="Enter Descriotion Here"
                />
                <div className="my-2 text-xs text-red-700">
                  {errors.description}
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => {
                      setEdit(false);
                    }}
                    className="hover:font-bold mt-3 lg:text-lg md:text-base text-md hover:shadow-lg duration-300 bg-red-700 hover:bg-red-900  text-white  border  lg:w-1/5 md:w-2/5 w-1/2 py-3 tracking-widest rounded-lg"
                  >
                    Cancel
                  </button>
               
                  <button
                    type="submit"
                    disabled={loading}
                    className="hover:font-bold mt-3 lg:text-lg md:text-base text-md hover:shadow-lg duration-300 bg-white text-primary hover:text-primary2  border  lg:w-1/5 md:w-2/5 w-1/2 py-3 tracking-widest rounded-lg"
                  >
                    Save
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      )}
    </>
  );
}

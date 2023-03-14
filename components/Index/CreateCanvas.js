import React, { useState } from "react";
import { Formik } from "formik";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import axios from "axios";

export default function CreateCanvas({ token }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // console.log("token from create canvas",token)

  const CreateCanvasFunction = async (values) => {
    // console.log(values);
    setLoading(true);
    const { name, description } = values;
    const loading = toast.loading("Please wait a moment...");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/canvasses/`,
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
            Authorization: `Token ${token}`,
          },
        }
      );
      const { status, data } = res;
      // console.log(res);
      setLoading(false);
      if (status === 201) {
        toast.dismiss(loading);

        toast.success("Canvas created successfully!");

        router.push("/");
      } else {
        toast.dismiss(loading);
        toast.error("Canvas Name Already Exists.");
      }
    } catch (error) {
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
    <div className="border-2 lg:p-10 p-5 mb-5 rounded-2xl bg-primary">
      <h5 className="font-display lg:text-3xl  md:text-2xl text-xl font-bold text-white text-center">
        Create a canvas
      </h5>

      <Formik
        initialValues={{ name: "", description: "" }}
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
        onSubmit={(values, { setSubmitting ,resetForm }) => {
          CreateCanvasFunction(values);
          resetForm();
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
            <div className="my-2 text-sm text-red-700 tracking-wider">{errors.name}</div>
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
            <div className="my-2 text-sm text-red-700 tracking-wider">
              {errors.description}
            </div>

            <div className="flex justify-end">
              <button
                disabled={loading}
                type="submit"
                className="hover:font-bold mt-3 lg:text-lg md:text-base text-md hover:shadow-lg duration-300 bg-white text-primary hover:text-primary2  border  lg:w-1/5 md:w-2/5 w-1/2 py-3 tracking-widest rounded-lg"
              >
                Post Canvas
              </button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}

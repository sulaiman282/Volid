import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import { Formik } from "formik";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";

export default function profile() {
  const [loading, setLoading] = useState(false);
  const [cookie, setCookie] = useCookies(["token", "user"]);
  const [userData, setUserData] = useState(cookie?.user);
  const router = useRouter();

  const [tempData, setTempData] = useState(null);
  !cookie.user?.token && router.push("/login");

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
        console.log(response);
        setTempData(response?.data?.user);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const UpdateProfile = async (values) => {
    setLoading(true);
    const { username, password } = values;
    const loading = toast.loading("Please wait a moment...");

    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/user/`, {
        user: {
            username: values?.username,
            ...(values?.password?.length > 0 && { password: values.password }),
            bio: values?.bio,
            image: values?.image,
            email: values?.email,
          },
      },{
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          Authorization: `Token ${userData?.token}`,
        },
      });
      const { status, data } = res;
      console.log(res);
      if (status === 200) {
        setCookie("user", data?.user, {
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
        toast.dismiss(loading);
        setLoading(false);
        toast.success("Profile updated Successfully !");

        // router.push("/");
      } else {
        toast.dismiss(loading);
        toast.error("Provided data is wrong");
        setLoading(false);
      }
    } catch (error) {
      const { status } = error?.response;
      //console.log(error);
      setLoading(false);
      if (status === 401) {
        toast.dismiss(loading);
        toast.error("Provided data is wrong");
      } else {
        toast.dismiss(loading);
        toast.error("Provided data is wrong!");
      }
    }
  };

  return (
    <>
      <Head>
        <title>My Profile - Volit</title>
      </Head>
      <div className="container-sk lg:py-20 py-10">
        <h1 className="lg:text-4xl md:text-3xl text-2xl font-display font-bold tracking-wide text-center">
          My Profile
        </h1>

        <div className="my-5 lg:w-1/2 mx-auto">
          <Formik
            enableReinitialize
            initialValues={{
              username: tempData?.username,
              email: tempData?.email,
              image: tempData?.image,
              bio: tempData?.bio,
              password: "",
            }}
            validate={(values) => {
              const errors = {};

              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              UpdateProfile(values);
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
                <div className="mb-4">
                  <label
                    className="block text-black font-display lg:text-xl md:text-lg text-base font-bold mb-2"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-none focus:border-2 focus:border-primary"
                    id="username"
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.username}
                  />
                  <div className="my-2 text-xs text-red-700">
                    {errors.username && touched.username && errors.username}
                  </div>
                </div>
                <div className="mb-4">
                  <label
                    className="block text-black font-display lg:text-xl md:text-lg text-base font-bold mb-2"
                    htmlFor="email"
                  >
                    email
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-none focus:border-2 focus:border-primary"
                    id="email"
                    type="text"
                    name="email"
                    placeholder="Enter your email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  <div className="my-2 text-xs text-red-700">
                    {errors.email && touched.email && errors.email}
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    className="block text-black  font-bold mb-2 font-display lg:text-xl md:text-lg text-base"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-none focus:border-2 focus:border-primary"
                    id="password"
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    placeholder="Enter your password"
                  />
                  <div className="my-2 text-xs text-red-700">
                    {errors.password && touched.password && errors.password}
                  </div>
                </div>
                <div className="mb-4">
                  <label
                    className="block text-black font-display lg:text-xl md:text-lg text-base font-bold mb-2"
                    htmlFor="bio"
                  >
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-none focus:border-2 focus:border-primary"
                    id="bio"
                    type="text"
                    name="bio"
                    placeholder="Enter your bio"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.bio}
                  />
                  <div className="my-2 text-xs text-red-700">
                    {errors.bio && touched.bio && errors.bio}
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    className="block text-black font-display lg:text-xl md:text-lg text-base font-bold mb-2"
                    htmlFor="image"
                  >
                    Image
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-none focus:border-2 focus:border-primary"
                    id="image"
                    type="text"
                    name="image"
                    placeholder="Enter your image"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.image}
                  />
                  <div className="my-2 text-xs text-red-700">
                    {errors.image && touched.image && errors.image}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary hover:bg-primary2 duration-300 text-white mt-4 rounded-md font-display lg:text-xl md:text-lg text-base font-bold tracking-wide"
                >
                  Update
                </button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}

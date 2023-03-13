import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import { Formik } from "formik";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
export default function Register() {
  const [loading, setLoading] = useState(false);
  const [cookie, setCookie] = useCookies(["token", "user"]);
  const router = useRouter();

  cookie.user?.token && router.push("/");




  const registerapi = async (values) => {
    // console.log(values)
    setLoading(true);
    const { username, password ,email} = values;
    const loading = toast.loading("Please wait a moment...");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/`,
        { user: { username, password,email } }
      );
      const { status, data } = res;
      // console.log(res);
      if (status === 201) {
       
        toast.dismiss(loading);
        setLoading(false);
        toast.success("Account Created Successfully ! Please Login.");

        router.push("/login");
      } 
      else if(status===401){
        toast.dismiss(loading);
        toast.error("User name already exists !");
        setLoading(false);
      }
    } catch (error) {
      const { status } = error?.response;
      //console.log(error);
      setLoading(false);
      toast.dismiss(loading);
      if (status === 401) {
        
        toast.error("User name already exists !");
      } 
      else {
        toast.error("Email or Username already exists");
      }
    }
  };
  return (
    <>
      <Head>
        <title>Register - Volit</title>
      </Head>

      <section className="md:bg-gray-100">
        <div className="w-full min-h-screen flex justify-center items-center container-sk">
          <div className="border-2 rounded-lg lg:w-1/2 md:w-4/5 w-full lg:p-20 md:p-10 p-5 bg-white">
            <h1 className="font-display text-center lg:text-5xl md:text-4xl text-3xl font-bold">
              Volit
            </h1>

            <h2 className="font-display  lg:text-3xl md:text-2xl text-xl font-bold mt-10  mb-5 underline underline-offset-8 text-center">
              User Register
            </h2>
            <Formik
              initialValues={{ username: "", password: "",email:"" }}
              validate={(values) => {
                const errors = {};
                if (!values.email) {
                  errors.email = "Required";
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                    values.email
                  )
                ) {
                  errors.email = "Invalid email address";
                }
                if (!values.username) {
                  errors.username = "Required";
                } else if (values.username.length < 4) {
                  errors.username = "Minimum 4 characters required";
                }
                if (!values.password) {
                  errors.password = "Required";
                } else if (values.password.length < 8) {
                  errors.password = "Minimum length must be 8 characters";
                }

                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                registerapi(values);
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
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.username}
                      placeholder="Enter your username"
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
                      Email
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-none focus:border-2 focus:border-primary"
                      id="email"
                      type="text"
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      placeholder="Enter your username"
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
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      placeholder="Enter your password"
                    />
                    <div className="my-2 text-xs text-red-700">
                      {errors.password && touched.password && errors.password}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-primary hover:bg-primary2 duration-300 text-white mt-4 rounded-md font-display lg:text-xl md:text-lg text-base font-bold tracking-wide"
                  >
                    Register
                  </button>
                </form>
              )}
            </Formik>
            <p className="mt-5 f font-display lg:text-xl md:text-lg text-base">
              Already have an account ?&nbsp;
              <Link
                href="/login"
                className="underline underline-offset-8 hover:text-red-700 duration-300"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

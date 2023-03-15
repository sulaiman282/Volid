import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import { Formik } from "formik";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
export default function Login() {
  const [loading, setLoading] = useState(false);
  const [cookie, setCookie] = useCookies(["token","user"]);
  const router = useRouter();


cookie.user?.token && router.push("/");






  const login = async (values) => {
   
    setLoading(true);
    const { username, password } = values;
    const loading = toast.loading("Please wait a moment...");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
        { user: { username, password } }
      );
      const { status, data } = res;
      console.log(res);
      if (status === 200) {
   
        
        setCookie("user", data?.user, {
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
        toast.dismiss(loading);
        setLoading(false);
        toast.success("Logged in Successfully !");
      
        router.push("/");
      } else {
        toast.dismiss(loading);
        toast.error("Login Failed! Username or Password doesn't match.");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      const { status } = error?.response;
    
      setLoading(false);
      if (status === 401) {
        toast.dismiss(loading);
        toast.error("Please provide your right credentials");
      } else {
        toast.dismiss(loading);
        toast.error("Login Failed!");
      }
    }
  };
  return (
    <>
      <Head>
        <title>Login - Volit</title>
      </Head>

      <section className="">
        <div className="w-full min-h-screen flex justify-center items-center container-sk">
          <div className="border-2 rounded-lg lg:w-1/2 md:w-4/5 w-full lg:p-20 md:p-10 p-5 bg-white">
            <h1 className="font-display text-center lg:text-5xl md:text-4xl text-3xl font-bold">
              Volit
            </h1>

            <h2 className="font-display  lg:text-3xl md:text-2xl text-xl font-bold mt-10  mb-5 underline underline-offset-8 text-center">
              User Login
            </h2>
            <Formik
              initialValues={{ username: "", password: "" }}
              validate={(values) => {
                const errors = {};

                if (!values.username) {
                  errors.username = "Required";
                }
               else if (values.username.length<4) {
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
                login(values);
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

                  <button type="submit" disabled={loading} className="w-full py-3 bg-primary hover:bg-primary2 duration-300 text-white mt-4 rounded-md font-display lg:text-xl md:text-lg text-base font-bold tracking-wide">
                    Login
                  </button>
                </form>
              )}
            </Formik>
            <p className="mt-5 f font-display lg:text-xl md:text-lg text-base">
              Don&apos;t have an account ?&nbsp;
              <Link
                href="/register"
                className="underline underline-offset-4 hover:text-red-700 duration-300"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

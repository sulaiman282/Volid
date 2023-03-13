import "../styles/globals.css";
import Layout from "../components/Layout/Layout";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Router from "next/router";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useState } from "react";

function MyApp({ Component, pageProps, router }) {
  NProgress.configure({ showSpinner: false });

  Router.events.on("routeChangeStart", () => {
    NProgress.start();
  });

  Router.events.on("routeChangeComplete", () => {
    NProgress.done();
  });

  const [showChild, setShowChild] = useState(false);

  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  if (typeof window === "undefined") {
    return <></>;
  } else {
    return (
      <>
        <Layout>
          <Toaster
            toastOptions={{
              duration: 3000,
              style: {
                background: "yellow",
                color: "white",
              },
              success: {
                style: {
                  background: "green",
                },
              },
              error: {
                style: {
                  background: "red",
                },
              },
            }}
          />
          <Component {...pageProps} />
        </Layout>
      </>
    );
  }
}
export default MyApp;

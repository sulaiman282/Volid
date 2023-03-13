import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCookies } from "react-cookie";

import Head from "next/head";
import axios from "axios";
import { useRouter } from "next/router";
import CanvasCard from "../../components/CanvasDetails/CanvasCard";
import CreateChoice from "../../components/CanvasDetails/CreateChoice";
import ChoiceList from "../../components/CanvasDetails/ChoiceList";
export default function Slug({ data }) {
  const router = useRouter();
  const { slug } = router.query;
  // console.log("Data", data);


  const [cookie, setCookie, removeCookie] = useCookies(["user"]);
  const [userData, setUserData] = useState(cookie?.user);

  useEffect(() => {
    setUserData(cookie?.user);
  }, [cookie, setUserData]);

  return (
    <>
      <Head>
        <title>{slug} - Volit</title>
      </Head>
      <div className="container-sk mt-5">
        <CanvasCard data={data} />

        {
          userData?.token && (
            <CreateChoice data={data}/>
          )
        }
        <ChoiceList/>
      </div>
    </>
  );
}
export async function getServerSideProps(context) {
  const { slug } = context.query;
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/canvasses/${slug}`
    );
    const data = response?.data?.canvass;

    return {
      props: {
        data,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      props: {},
    };
  }
}

import React from "react";
import Head from "next/head";
import GetAllCanvas from "../components/Index/GetAllCanvas";
import axios from "axios";

export default function Index({ data }) {
  return (
    <>
      <Head>
        <title>Volit</title>
      </Head>
      <GetAllCanvas data={data} />
    </>
  );
}
export async function getServerSideProps({ query }) {
  const { owner } = query;
  try {
    if (owner?.length > 0) {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/canvasses/`,
        {
          params: {
            owner: owner,
          },
        }
      );
      const data = response?.data?.canvasses;

      return {
        props: {
          data,
        },
      };
    } else {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/canvasses/`
      );
      const data = response?.data?.canvasses;

      return {
        props: {
          data,
        },
      };
    }
  } catch (error) {
    console.error(error);

    return {
      props: {},
    };
  }
}

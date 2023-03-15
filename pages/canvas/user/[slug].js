import React from "react";
import GetAllCanvas from "../../../components/UserBasedCanvases/GetAllCanvas";
import axios from "axios";
import { useRouter } from "next/router";
import Head from "next/head";
export default function UserBasedCanvases({ data }) {

  const router = useRouter();
  const { slug } = router.query;

  return (
  <>
    <Head>
    <title>{slug} - Volit</title>
  </Head>
    <div>
      <GetAllCanvas data={data} />
    </div>
  </>
  );
}
export async function getServerSideProps(context) {
  const { slug } = context.params;
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/canvasses-owner/${slug}/`
    );
    const data = response?.data?.canvasses;

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

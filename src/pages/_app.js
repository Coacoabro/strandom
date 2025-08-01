import "../styles/globals.css";
import Layout from "../components/Layout"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from "react";
import Head from "next/head";



export default function Strandom({ Component, pageProps }) {

  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <title>Strandom</title>
        <meta name="description" content="Daily word connecting puzzle from all of your favorite Fandoms!" />
        <meta name="keywords" content="strands, strand-style puzzle, daily puzzle, daily puzzle game, free puzzle game, daily strands puzzle, fandom strands, video game strands, anime strands, movie strands, cartoon strands" />
        <link rel="icon" href="/images/favicon.ico" type="image/x-icon" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  );
}


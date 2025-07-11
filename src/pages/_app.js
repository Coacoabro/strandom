import "../styles/globals.css";
import Layout from "../components/Layout"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from "react";



export default function Strandom({ Component, pageProps }) {

  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  );
}


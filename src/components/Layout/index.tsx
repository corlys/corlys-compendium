import { NextPage } from "next";
import Head from "next/head";
import { ReactNode } from "react";

import Header from "@/components/Layout/Header";

type LayoutProps = {
  children: ReactNode;
};

const Layout: NextPage<LayoutProps> = ({ children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>Blog with SIWE</title>
        <meta name="description" content="Blog with sign in with Ethereum" />
        <link rel="icon" href="/soul.png" />
      </Head>
      <Header />
      {children}
    </>
  );
};

export default Layout;

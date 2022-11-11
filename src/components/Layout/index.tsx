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
      <main className="mx-auto max-w-[52rem] px-4 pb-28 sm:px-6 md:px-8 lg:max-w-6xl xl:px-12">
        {children}
      </main>
    </>
  );
};

export default Layout;

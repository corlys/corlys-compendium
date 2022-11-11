import { type AppType } from "next/dist/shared/lib/utils";
import type { AppProps } from "next/app";

import "../styles/globals.css";

import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";
import { wagmiClient, chains } from "@/config/rainbow-config";

import Layout from "@/components/Layout";

import { AuthContextProvider } from "@/context/auth";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <AuthContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthContextProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default MyApp;

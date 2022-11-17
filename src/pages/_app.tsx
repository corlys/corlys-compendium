import { type AppType } from "next/dist/shared/lib/utils";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../styles/globals.css";

import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";
import { wagmiClient, chains } from "@/config/rainbow-config";

import Layout from "@/components/Layout";

import { AuthContextProvider } from "@/context/auth";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const queryClient = new QueryClient();
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <AuthContextProvider>
          <QueryClientProvider client={queryClient}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </QueryClientProvider>
        </AuthContextProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default MyApp;

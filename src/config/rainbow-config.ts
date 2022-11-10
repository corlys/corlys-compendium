import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { Chain, chain, configureChains, createClient } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const astarchain: Chain = {
  id: 592,
  name: "Astar Network",
  network: "astar",
  // iconUrl: 'https://example.com/icon.svg',
  // iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: "ASTAR",
    symbol: "ASTR",
  },
  rpcUrls: {
    default: "https://astar.public.blastapi.io",
  },
  blockExplorers: {
    default: { name: "Subscan", url: "https://astar.subscan.io" },
    etherscan: { name: "Blockscout", url: "https://blockscout.com/astar" },
  },
  testnet: false,
};

const { chains, provider } = configureChains(
  [astarchain, chain.mainnet, chain.polygon, chain.polygonMumbai, chain.goerli],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_ID || "" }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export { wagmiClient, chains };

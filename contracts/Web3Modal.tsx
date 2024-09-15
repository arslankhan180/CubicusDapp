/* eslint-disable @typescript-eslint/no-explicit-any */
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";

const projectId = "86ca01c30a737efcc2113f60037fee6e";

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: "Ethereum",
  currency: "ETH",
  explorerUrl: "https://etherscan.io",
  rpcUrl: "https://cloudflare-eth.com",
};

// 3. Create a metadata object
const metadata = {
  name: "Cubicus.io",
  description: "My Website description",
  url: "https://cubicus.io", // origin must match your domain & subdomain
  icons: ["https://cubicus.io/logo.svg"],
};

const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: "...", // used for the Coinbase SDK
  defaultChainId: 1, // used for the Coinbase SDK
});

// 5. Create a AppKit instance
createWeb3Modal({
  ethersConfig,
  chains: [mainnet],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

export function AppKit({ children }: any) {
  return children;
}

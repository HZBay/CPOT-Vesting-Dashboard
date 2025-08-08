"use client";

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultConfig,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider, type Chain } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const hashkeyTestnet: Chain = {
  id: 133,
  name: 'HashKey Chain Testnet',
  nativeCurrency: { name: 'HSK', symbol: 'HSK', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet.hsk.xyz'] },
  },
  blockExplorers: {
    default: { name: 'HashKey Explorer', url: 'https://testnet-explorer.hsk.xyz' },
  },
  testnet: true,
};

const config = getDefaultConfig({
  appName: 'HZ Vesting Dashboard',
  projectId: 'c9535761828f09004f141133379058b2', // Replace with your WalletConnect Project ID
  chains: [hashkeyTestnet],
  ssr: true,
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
            theme={darkTheme({
                accentColor: 'hsl(var(--primary))',
                accentColorForeground: 'hsl(var(--primary-foreground))',
                borderRadius: 'medium',
            })}
        >
            {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

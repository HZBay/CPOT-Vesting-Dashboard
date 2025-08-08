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
  appName: 'CPOT Vesting Dashboard',
  // IMPORTANT: Replace "YOUR_PROJECT_ID" with your actual WalletConnect Project ID
  // and add your app's domain to the allowlist at https://cloud.walletconnect.com/
  projectId: '1405e4f952e2630cf406cb00bc9cfb72', 
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

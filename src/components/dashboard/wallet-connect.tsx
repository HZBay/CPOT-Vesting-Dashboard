'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

export default function WalletConnect() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        if (!ready) {
          return (
            <div
              aria-hidden="true"
              style={{
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            />
          );
        }

        if (!connected) {
          return (
            <Button onClick={openConnectModal} type="button">
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          );
        }

        if (chain.unsupported) {
          return (
            <Button onClick={openChainModal} type="button" variant="destructive">
              Wrong network
            </Button>
          );
        }

        return (
          <div className="flex gap-2">
            <Button
              onClick={openChainModal}
              type="button"
              variant="outline"
            >
              {chain.hasIcon && (
                <div
                  style={{
                    background: chain.iconBackground,
                    width: 16,
                    height: 16,
                    borderRadius: 999,
                    overflow: 'hidden',
                    marginRight: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {chain.iconUrl && (
                    <img
                      alt={chain.name ?? 'Chain icon'}
                      src={chain.iconUrl}
                      style={{ width: 16, height: 16 }}
                    />
                  )}
                </div>
              )}
              <span className="hidden sm:inline">{chain.name}</span>
            </Button>

            <Button onClick={openAccountModal} type="button">
              {account.displayName}
            </Button>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

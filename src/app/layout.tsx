import type {Metadata} from 'next';
import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { Web3Provider } from '@/components/providers/web3-provider';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'CPOT Vesting Dashboard',
  description: 'Manage your CPOT token vesting schedules.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet"></link>
      </head>
      <body className="font-body antialiased">
        <Web3Provider>
          {children}
          <Toaster />
        </Web3Provider>
      </body>
    </html>
  );
}

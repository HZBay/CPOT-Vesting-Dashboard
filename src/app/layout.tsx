import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { Web3Provider } from '@/components/providers/web3-provider';
import { Toaster } from "@/components/ui/toaster"
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export async function generateMetadata({params: {locale}}: {params: {locale: string}}) {
  const messages = await getMessages();
  const t = (key: string) => messages.Metadata[key as keyof typeof messages.Metadata] || key;

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function RootLayout({
  children,
  params: {locale}
}: Readonly<{
  children: React.ReactNode;
  params: {locale: string};
}>) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet"></link>
      </head>
      <body className="font-body antialiased">
        <NextIntlClientProvider messages={messages}>
          <Web3Provider>
            {children}
            <Toaster />
          </Web3Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

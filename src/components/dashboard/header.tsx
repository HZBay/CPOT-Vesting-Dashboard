import WalletConnect from './wallet-connect';
import LanguageSwitcher from './language-switcher';
import {useTranslations} from 'next-intl';

export default function Header() {
  const t = useTranslations('Header');
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="flex items-center">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                <span className="ml-2 font-bold font-headline">{t('title')}</span>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <WalletConnect />
            <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}

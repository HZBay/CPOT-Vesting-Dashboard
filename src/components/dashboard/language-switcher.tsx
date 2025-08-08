'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const t = useTranslations('LanguageSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const onSelectChange = (newLocale: string) => {
    // The pathname returned by `usePathname` includes the current locale.
    // We need to remove the current locale from the beginning of the path.
    const newPath = pathname.startsWith(`/${locale}`) 
      ? pathname.substring(locale.length + 1)
      : pathname;
    
    // The root path might become empty, so we ensure it's at least `/`.
    const finalPath = newPath || '/';
    
    router.replace(`/${newLocale}${finalPath}`);
  };

  return (
    <Select value={locale} onValueChange={onSelectChange}>
      <SelectTrigger className="w-auto gap-2">
        <Globe className="h-4 w-4" />
        <SelectValue placeholder={t('label')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">{t('en')}</SelectItem>
        <SelectItem value="zh">{t('zh')}</SelectItem>
      </SelectContent>
    </Select>
  );
}

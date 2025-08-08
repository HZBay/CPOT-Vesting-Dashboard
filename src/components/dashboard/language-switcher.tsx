'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next-intl/client';
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

  const onSelectChange = (value: string) => {
    router.replace(pathname, { locale: value });
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

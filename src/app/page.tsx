// This file is now redundant, as the root page is handled by [locale]/page.tsx.
// To avoid build errors or confusion, we can redirect to the default locale.
// In a real-world scenario, you might have a language detection page here.
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/en');
}

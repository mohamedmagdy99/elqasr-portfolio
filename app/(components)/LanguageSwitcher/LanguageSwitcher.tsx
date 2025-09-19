// components/LanguageSwitcher.tsx

'use client'; // This is crucial for a Client Component

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { ChangeEvent } from 'react';

export default function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const newLocale = event.target.value;

        // Use router.replace to update the URL with the new locale
        // It maintains the current page and updates the locale prefix.
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <select
            value={locale}
            onChange={handleChange}
            className="bg-gray-100 text-gray-800 font-medium border border-gray-300 rounded-lg p-2
               hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500
               transition-colors duration-200 cursor-pointer"
        >
            <option value="en" className="text-gray-800">English</option>
            <option value="ar" className="text-gray-800">العربية (Arabic)</option>
        </select>
    );
}
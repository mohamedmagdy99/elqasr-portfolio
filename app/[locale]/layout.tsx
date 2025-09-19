// app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from '@components/Navbar/Navbar';
import Footer from '@components/Footer/Footer';
import * as motion from "motion/react-client";
import {TanstackProvider } from "@/components/providers/tanstack-provider";
import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import NextAuthProvider from '@/components/providers/NextAuthProvider';

const geistSans = Geist({
    subsets: ["latin"],
    weight: ["400", "700"],
    style: "normal",
});

const geistMono = Geist_Mono({
    subsets: ["latin"],
    weight: ["400"],
    style: "normal",
});

export const metadata: Metadata = {
    title: "ALQASR REAL ESTATE DEVELOPMENT",
    description: "this is an offical website for alqasr real estate development.",
};

export default async function RootLayout({
                                             children,
                                             params,
                                         }: {
    children: React.ReactNode;
    params: { locale: string };
}){
    const { locale } = await params;

    const fadeIn = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    // Check if the locale from the URL is supported
    const isSupportedLocale = routing.locales.includes(locale as 'en' | 'ar');
    if (!isSupportedLocale) {
        notFound();
    }

    // Fetch messages for the current locale
    const messages = (await import(`../../i18n/messages/${locale}.json`)).default;
    const isRtl = locale === 'ar';

    return (
        <html lang={locale} dir={isRtl ? 'rtl' : 'ltr'} className={`${geistSans.className} ${geistMono.className}`}>
        <head>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "El Qasr Development",
                        "url": "https://elqasr-development.com",
                        "logo": "https://realestate-gallery.s3.eu-central-1.amazonaws.com/projects/elqasr-logo.png"
                    })
                }}
            />
        </head>
        <body className="antialiased">
        <TanstackProvider dehydratedState={undefined}>
            <NextAuthProvider>
                {/* ✅ Correctly pass the locale and messages to the provider. 
                  This is the key step to making client components reactive.
                */}
                <NextIntlClientProvider locale={locale} messages={messages}>
                    {/* ✅ Navbar now inside SessionProvider */}
                    <nav className="sticky top-0 bg-white shadow-sm md:border-b border-gray-300 z-50">
                        <Navbar />
                    </nav>
                    {/* ✅ Page content */}
                    {children}
                    {/* ✅ Footer also inside provider */}
                    <motion.footer
                        className="bg-gray-900 text-white py-12"
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <Footer />
                    </motion.footer>
                </NextIntlClientProvider>
            </NextAuthProvider>
        </TanstackProvider>
        </body>
        </html>
    );
}
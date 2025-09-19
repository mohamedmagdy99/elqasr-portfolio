// app/auth/signin/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import * as motion from "motion/react-client";
import logo from "@/public/elqasr-logo.png";
import { EyeOff, Eye } from 'lucide-react';
import Image from "next/image";
import Head from "next/head";
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const t = useTranslations('SignInPage');
    const locale = useLocale();
    const isRtl = locale === 'ar';

    const slideInLeft = {
        initial: { opacity: 0, x: -60 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.7, ease: "easeOut" }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Login failed. Please check your credentials.");
            } else {
                router.push(`/${locale}`);

            }
        } catch (err) {
            console.error("An unexpected error occurred:", err);
            setError("An unexpected error occurred. Please try again later.");
        }
    };

    return (
        <main className="flex-grow flex min-h-screen">
            <Head>
                <title>{t('page_title')}</title>
                <meta
                    name="description"
                    content={t('meta_description')}
                />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content={t('og_title')} />
                <meta property="og:description" content={t('og_description')} />
                <meta property="og:image" content="https://realestate-gallery.s3.eu-central-1.amazonaws.com/projects/1757505764687-%C3%98%C2%A7%C3%99%C2%84%C3%99%C2%82%C3%98%C2%B5%C3%98%C2%B1+copy.png" />
                <meta property="og:url" content="https://elqasr-development.com" />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <motion.div
                className={`grid grid-cols-1 md:grid-cols-2 w-full ${isRtl ? 'md:grid-cols-2-rtl' : ''}`}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={slideInLeft}
                dir={isRtl ? 'rtl' : 'ltr'}
            >

                <div className="hidden md:flex items-center justify-center bg-gray-200 p-4">
                    <Image
                        src={logo}
                        alt={t('image_alt')}
                        className="w-full max-w-lg h-auto object-contain"
                    />
                </div>
                <div className="flex items-center justify-center bg-gray-700 px-4 sm:px-6 lg:px-8 py-12">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-md p-6 sm:p-8 bg-white rounded-2xl shadow-lg"
                    >
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
                            {t('form_heading')}
                        </h2>

                        <input
                            type="email"
                            placeholder={t('email_placeholder')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4 text-gray-700"
                            required
                        />

                        <div className="relative mb-6">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder={t('password_placeholder')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none pr-12 text-gray-700"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-800"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
                        <button
                            type="submit"
                            className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-lg sm:text-base"
                        >
                            {t('sign_in_button')}
                        </button>
                    </form>
                </div>
            </motion.div>
        </main>
    );
}
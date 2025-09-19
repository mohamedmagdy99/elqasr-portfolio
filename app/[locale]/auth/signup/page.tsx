// app/auth/signup/page.tsx
'use client';

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import * as motion from "motion/react-client";
import logo from "@/public/elqasr-logo.png";
import { EyeOff, Eye } from 'lucide-react';
import Image from "next/image";
import { signup } from "@/server/Users";
import Head from "next/head";
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

export default function SignUpPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [success, setSuccess] = useState<string | null>(null);

    const t = useTranslations('SignUpPage');
    const locale = useLocale();
    const isRtl = locale === 'ar';

    const slideInLeft = {
        initial: { opacity: 0, x: -60 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.7, ease: "easeOut" }
    };

    // Conditional animation based on locale
    const slideInVariants = isRtl ? { initial: { opacity: 0, x: 60 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.7, ease: "easeOut" } } : slideInLeft;


    const mutation = useMutation({
        mutationFn: signup,
        onSuccess: (data) => {
            if (data.success) {
                signIn('credentials', { email, password, callbackUrl: '/' });
            } else {
                setError(data.message || t('error_failed_to_signup'));
            }
        },
        onError: (err: Error) => {
            setError(err?.message || t('error_something_went_wrong'));
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ name, email, password });
    };

    return (
        <main className="flex-grow flex min-h-screen" dir={isRtl ? 'rtl' : 'ltr'}>
            <Head>
                <title>{t('page_title')}</title>
                <meta
                    name="description"
                    content={t('meta_description')}
                />
                <meta name="robots" content="index, follow" />
            </Head>
            <motion.div
                className={`grid grid-cols-1 md:grid-cols-2 w-full ${isRtl ? 'md:grid-cols-2-rtl' : ''}`}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={slideInVariants}
            >
                {/* Left side - Image */}
                <div className={`hidden md:flex items-center justify-center bg-gray-200 p-4 ${isRtl ? 'order-2' : ''}`}>
                    <Image
                        src={logo}
                        alt={t('image_alt')}
                        className="w-full max-w-lg h-auto object-contain"
                    />
                </div>

                {/* Right side - Form */}
                <div className={`flex items-center justify-center bg-gray-700 px-4 sm:px-6 lg:px-8 py-12 ${isRtl ? 'order-1' : ''}`}>
                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-md p-6 sm:p-8 bg-white rounded-2xl shadow-lg"
                    >
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
                            {t('form_heading')}
                        </h2>

                        <input
                            type="text"
                            placeholder={t('full_name_placeholder')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4 text-gray-700"
                            required
                        />

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
                                className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-800`}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
                        {success && <p className="text-green-600 mb-4 text-center">{success}</p>}

                        <button
                            type="submit"
                            className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-lg sm:text-base"
                        >
                            {t('sign_up_button')}
                        </button>
                    </form>
                </div>
            </motion.div>
        </main>
    );
}
// components/Navbar/Navbar.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import logo from '../../../public/elqasr-logo.png';
import * as motion from "motion/react-client";
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import LanguageSwitcher from '@components/LanguageSwitcher/LanguageSwitcher';
import { easeOut } from "framer-motion";



export default function Navbar() {
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === 'admin';
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const t = useTranslations('Navbar');
    const locale = useLocale();
    const isRtl = locale === 'ar';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, setIsOpen]);

    const navbarVariant = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: easeOut,
                staggerChildren: 0.1,
                delayChildren: 0.2
            },
        },
    };

    // Define the animation based on the locale
    const mobileMenuVariants = {
        hidden: {
            x: isRtl ? '-100%' : '100%',
        },
        visible: {
            x: '0%',
        },
    } ;

    return (
        <>
            <motion.div
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                variants={navbarVariant}
                initial="hidden"
                animate="visible"
                dir={isRtl ? 'rtl' : 'ltr'}
            >
                <div className="w-full max-w-screen-xl flex justify-between items-center py-4 px-4 md:px-8 mx-auto gap-8">
                    <div>
                        <Link href="/">
                            <Image
                                src={logo}
                                alt={t('logo_alt')}
                                className="w-20 h-auto"
                            />
                        </Link>
                    </div>
                    <ul className="hidden md:flex justify-center gap-6">
                        <motion.li whileHover={{scale: 1.05, y: -2}} className="relative cursor-pointer">
                            <Link href="/" className="text-gray-700 hover:text-blue-500 transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full">{t('home_link')}</Link>
                        </motion.li>
                        <motion.li whileHover={{scale: 1.05, y: -2}} className="relative cursor-pointer">
                            <Link href="/Projects" className="text-gray-700 hover:text-blue-500 transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full">{t('projects_link')}</Link>
                        </motion.li>
                        <motion.li whileHover={{scale: 1.05, y: -2}} className="relative cursor-pointer">
                            <Link href="/About" className="text-gray-700 hover:text-blue-500 transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full">{t('about_link')}</Link>
                        </motion.li>
                        <motion.li whileHover={{scale: 1.05, y: -2}} className="relative cursor-pointer">
                            <Link href="/Contact" className="text-gray-700 hover:text-blue-500 transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full">{t('contact_link')}</Link>
                        </motion.li>
                        {isAdmin && (
                            <>
                                <motion.li whileHover={{scale: 1.05, y: -2}} className="relative cursor-pointer">
                                    <Link href="/Admin" className="text-gray-700 hover:text-blue-500 transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full">
                                        {t('admin_link')}
                                    </Link>
                                </motion.li>
                                <motion.li whileHover={{scale: 1.05, y: -2}} className="relative cursor-pointer">
                                    <Link href="api/auth/signup" className="text-gray-700 hover:text-blue-500 transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full">
                                        {t('make_email_link')}
                                    </Link>
                                </motion.li>
                                <motion.li whileHover={{scale: 1.05, y: -2}} className="relative cursor-pointer">
                                    <button
                                        className="text-gray-700 hover:text-blue-500 transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
                                        onClick={() => signOut({ callbackUrl: "/" })}
                                    >
                                        <LogOut className="w-5 h-5 mx-auto mb-4" />
                                    </button>
                                </motion.li>
                            </>
                        )}
                        <LanguageSwitcher />
                    </ul>
                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-500 mr-3">
                        ☰
                    </button>
                </div>
            </motion.div>
            <motion.div
                ref={menuRef}
                initial={isRtl ? "hidden" : "hidden"}
                animate={isOpen ? "visible" : "hidden"}
                variants={mobileMenuVariants}
                className={`fixed top-0 ${isRtl ? 'left-0' : 'right-0'} w-64 h-full bg-gray-800 text-white p-6 z-50 md:hidden`}
            >
                <button onClick={() => setIsOpen(false)} className={`mb-4 text-xl ${isRtl ? 'text-left' : 'text-right'}`}>×</button>
                <ul className="flex flex-col gap-4">
                    <motion.li whileHover={{scale: 1.05, y: -2}} className="relative cursor-pointer">
                        <Link href="/" className="text-white hover:text-blue-500 transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full" onClick={() => setIsOpen(false)}>
                            {t('home_link')}
                        </Link>
                    </motion.li>
                    <motion.li whileHover={{scale: 1.05, y: -2}} className="relative cursor-pointer">
                        <Link href="/Projects" className="text-white hover:text-blue-500 transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full" onClick={() => setIsOpen(false)}>
                            {t('projects_link')}
                        </Link>
                    </motion.li>
                    <motion.li whileHover={{scale: 1.05, y: -2}} className="relative cursor-pointer">
                        <Link href="/About" className="text-white hover:text-blue-500 transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full" onClick={() => setIsOpen(false)}>
                            {t('about_link')}
                        </Link>
                    </motion.li>
                    <motion.li whileHover={{scale: 1.05, y: -2}} className="relative cursor-pointer">
                        <Link href="/Contact" className="text-white hover:text-blue-500 transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full" onClick={() => setIsOpen(false)}>
                            {t('contact_link')}
                        </Link>
                    </motion.li>
                    {isAdmin && (
                        <>
                            <motion.li whileHover={{scale: 1.05, y: -2}} className="relative cursor-pointer">
                                <Link href="/Admin" className="text-white hover:text-blue-500 transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full">
                                    {t('admin_link')}
                                </Link>
                            </motion.li>
                            <motion.li whileHover={{scale: 1.05, y: -2}} className="relative cursor-pointer">
                                <button
                                    className="text-white hover:text-blue-500 transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                >
                                    <LogOut className="w-5 h-5 mx-auto mb-4" />
                                </button>
                            </motion.li>
                        </>
                    )}
                    <LanguageSwitcher />
                </ul>
            </motion.div>
        </>
    );
}

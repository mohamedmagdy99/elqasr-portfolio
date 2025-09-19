// components/Footer/Footer.tsx

'use client'; // This is crucial

import React from 'react';
import * as motion from "motion/react-client";
import Image from "next/image";
import logo from '../../../public/footer-logo.png';
import { Separator } from '@/components/ui/separator';
import FooterCard from '@components/FooterCard/FooterCart';
import { useTranslations } from 'next-intl'; // Use the client-side hook
import { useLocale } from 'next-intl'; // Use the client-side hook

const Footer = () => {
    // These hooks will now react to locale changes
    const t = useTranslations('Footer');
    const locale = useLocale();
    const isRtl = locale === 'ar';

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };
    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    const Services: string[] = [t('services_residential'), t('services_commercial')];
    const contact: string[] = [
        t('contact_phone'),
        t('contact_email'),
        t('contact_address_line1'),
        t('contact_address_line2')
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" dir={isRtl ? 'rtl' : 'ltr'}>
            <motion.div
                className="grid md:grid-cols-4 gap-8"
                variants={staggerContainer}
            >
                <motion.div variants={fadeInUp}>
                    <div className="flex items-center space-x-2 mb-4">
                        <Image src={logo} alt={t('logo_alt')} style={{ width: "2rem", height: "2rem" }} />
                        <span className="text-xl font-bold">{t('company_name')}</span>
                    </div>
                    <p className="text-gray-400">{t('slogan')}</p>
                </motion.div>
                <FooterCard Title={t('services_title')} list={Services} />
                <FooterCard Title={t('contact_title')} list={contact} />
                <motion.div variants={fadeInUp}>
                    <h3 className="font-semibold mb-4">{t('social_title')}</h3>
                    <ul className="space-y-2 text-gray-400">
                        <li>
                            <a href="https://www.facebook.com/elqasr123?locale=ar_AR" target="_blank" rel="noreferrer">Facebook</a>
                        </li>
                        <li>
                            <a href="https://www.instagram.com/elqasr_development/" target="_blank" rel="noreferrer">Instagram</a>
                        </li>
                    </ul>
                </motion.div>
            </motion.div>
            <Separator className="my-8 bg-gray-800" />
            <motion.div
                className="text-center text-gray-400"
                variants={fadeInUp}
            >
                <p>{t('copyright', { year: new Date().getFullYear() })}</p>
            </motion.div>
        </div>
    )
}
export default Footer;
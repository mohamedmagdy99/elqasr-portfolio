// components/ContactSection/ContactSection.tsx
'use client';

import React from 'react';
import * as motion from "motion/react-client";
import ContactCard from '@components/ContactCard/ContactCard';

import { Phone, Mail, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

const ContactSection = () => {
    const t = useTranslations('ContactSection');
    const locale = useLocale();
    const isRtl = locale === 'ar';

    const fadeIn = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.8, ease: "easeOut" }
    };
    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" dir={isRtl ? 'rtl' : 'ltr'}>
            <motion.div
                className="text-center mb-16"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeIn}
            >
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
                <p className="text-xl text-gray-600">{t('subtitle')}</p>
            </motion.div>
            <motion.div
                className="grid lg:grid-cols-3 gap-8"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
            >
                <ContactCard
                    Title={t('call_us.title')}
                    Description={t('call_us.description')}
                    Content={t('call_us.content')}
                    icon={<Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />}
                />
                <ContactCard
                    Title={t('email_us.title')}
                    Description={t('email_us.description')}
                    Content={t('email_us.content')}
                    icon={<Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />}
                    Delay={0.5}
                />
                <ContactCard
                    Title={t('visit_us.title')}
                    Description={t('visit_us.description')}
                    Content={t('visit_us.content')}
                    icon={<MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />}
                    Delay={1}
                />
            </motion.div>
        </div>
    );
};
export default ContactSection;
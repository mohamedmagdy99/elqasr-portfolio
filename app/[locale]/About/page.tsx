'use client';

import React from 'react'
import * as motion from "motion/react-client";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';

import Construction from "../../../public/Construction-site.jpeg"
import Transition from "@components/Transition/Transition";
import ContentCard from '@components/ContactCard/ContactCard';
import Hero from '@components/PagesHero/PagesHero';

import {  Target, Eye, Heart,Phone } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Head from "next/head";

const Page = () => {
    const router = useRouter();
    const t = useTranslations('AboutPage');
    const locale = useLocale();
    const isRtl = locale === 'ar';



    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    const slideInLeft = {
        initial: { opacity: 0, x: -60 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.7, ease: "easeOut" }
    };

    const slideInRight = {
        initial: { opacity: 0, x: 60 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.7, ease: "easeOut" }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    // Conditional animation based on locale
    const slideInContentVariants = isRtl ? slideInRight : slideInLeft;
    const slideInImageVariants = isRtl ? slideInLeft : slideInRight;

    return (
        <Transition>
            <Head>
                <title>{t('page_title')}</title>
                <meta name="description" content={t('meta_description')} />
                <meta name="robots" content="index, follow" />
            </Head>
            <div className="min-h-screen bg-white" dir={isRtl ? 'rtl' : 'ltr'}>
                <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
                    <Hero title={t('hero_title')} description={t('hero_description')}/>
                </section>
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className={`grid lg:grid-cols-2 gap-12 items-center ${isRtl ? 'lg:flex-row-reverse' : ''}`}>
                            <motion.div
                                initial="initial"
                                whileInView="animate"
                                viewport={{ once: true }}
                                variants={slideInContentVariants}
                            >
                                <motion.h2
                                    className="text-4xl font-bold text-gray-900 mb-6"
                                    variants={fadeInUp}
                                >
                                    {t('our_story_title')}
                                </motion.h2>
                                <motion.div
                                    className="space-y-4 text-lg text-gray-600"
                                    variants={staggerContainer}
                                >
                                    <motion.p variants={fadeInUp}>
                                        {t('our_story_p1')}
                                    </motion.p>
                                    <motion.p variants={fadeInUp}>
                                        {t('our_story_p2')}
                                    </motion.p>
                                    <motion.p variants={fadeInUp}>
                                        {t('our_story_p3')}
                                    </motion.p>
                                </motion.div>
                            </motion.div>
                            <motion.div
                                initial="initial"
                                whileInView="animate"
                                viewport={{ once: true }}
                                variants={slideInImageVariants}
                            >
                                <motion.div
                                    whileHover={{scale: 1.02}}
                                    transition={{duration: 0.3}}
                                >
                                    <Image src={Construction} alt={t('story_image_alt')} style={{ borderRadius: '1rem', boxShadow:'0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)', width:"100%", height:"24rem"}}/>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </section>
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            className="text-center mb-16"
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('foundation_title')}</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('foundation_subtitle')}</p>
                        </motion.div>
                        <motion.div
                            className="grid lg:grid-cols-3 gap-8"
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                        >
                            <ContentCard Title={t('mission_title')} icon={<Target className="w-16 h-16 text-blue-600 mx-auto mb-4"/>} Content={t('mission_content')} />
                            <ContentCard Title={t('vision_title')} Content={t('vision_content')} icon={<Eye className="w-16 h-16 text-blue-600 mx-auto mb-4" />} Delay={0.5} />
                            <ContentCard Title={t('values_title')} Content={t('values_content')} icon={<Heart className="w-16 h-16 text-blue-600 mx-auto mb-4" />} Delay={1} />
                        </motion.div>
                    </div>
                </section>
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            className="text-center"
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('cta_title')}</h2>
                            <p className="text-xl text-gray-600 mb-8 max-x-2xl mx-auto">{t('cta_description')}</p>
                            <div className="flex sm:flex-row flex-col gap-4 justify-center">
                                <Button
                                    size="lg"
                                    asChild
                                    className="text-lg px-8 py-6"
                                >
                                    <Link href="/Contact">
                                        <Phone className="w-5 h-5 mr-2" />
                                        {t('cta_contact_button')}
                                    </Link>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    asChild
                                    className="text-lg px-8 py-6"
                                >
                                    <Link href="/Projects">
                                        {t('cta_projects_button')}
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </Transition>
    )
}
export default Page;
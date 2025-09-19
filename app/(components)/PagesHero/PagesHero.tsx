// components/PagesHero/PagesHero.tsx
'use client';
import React from 'react'
import * as motion from "motion/react-client";
import Image from "next/image";
import logo from "@/public/elqasr-logo.png";
import { useLocale } from 'next-intl';

interface Props {
    title: string,
    description: string,
}

const PagesHero = ({title,description}:Props) => {
    const locale = useLocale();
    const isRtl = locale === 'ar';

    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    return (
        <div className="max-w-7xl px-4 mx-auto sm:px-6 lg:px-8" dir={isRtl ? 'rtl' : 'ltr'}>
            <motion.div
                className="text-center"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
            >
                <motion.div
                    className="flex items-center justify-center space-x-2 mb-6"
                    variants={fadeInUp}
                >
                    <Image src={logo} alt="Alqasr Logo"  style={{ width: "15rem", height: "15rem"}} />
                </motion.div>
                <motion.h1
                    className="text-4xl font-bold text-gray-900 mb-6"
                    variants={fadeInUp}
                >
                    {title}
                </motion.h1>
                <motion.p
                    className="text-xl text-gray-600 max-w-3xl mx-auto"
                    variants={fadeInUp}
                    transition={{ delay: 0.1 }}
                >
                    {description}
                </motion.p>
            </motion.div>
        </div>
    )
}
export default PagesHero;
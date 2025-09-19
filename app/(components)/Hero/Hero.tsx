// components/Hero/Hero.tsx
'use client';

import * as motion from "motion/react-client";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import modernBuilding from "@/public/modern-building-hero-section.jpg";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

export default function Hero() {
    const t = useTranslations('Hero');
    const locale = useLocale();
    const isRtl = locale === 'ar';

    // This class handles the layout reversal
    const flexDirectionClass = isRtl ? 'lg:flex-row-reverse' : 'lg:flex-row';

    const slideInLeft = {
        initial: { opacity: 0, x: -60 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.7, ease: "easeOut" }
    };
    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    };
    const slideInRight = {
        initial: { opacity: 0, x: 60 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.7, ease: "easeOut" }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" dir={isRtl ? 'rtl' : 'ltr'}>
            {/* The conditional class is applied here */}
            <div className={`flex flex-col ${flexDirectionClass} items-center gap-12 justify-center py-6`}>
                {/* Text section */}
                <motion.div
                    className="w-full lg:w-1/2 p-6"
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={isRtl ? slideInRight : slideInLeft} // Adjust animation for RTL
                >
                    <motion.h1
                        className="text-4xl font-bold text-gray-900 mb-6"
                        variants={fadeInUp}
                    >
                        {t.rich('heading', {
                            highlight: (chunks) => <span className="text-blue-600">{chunks}</span>
                        })}
                    </motion.h1>
                    <motion.p
                        className="text-lg text-gray-600 mb-6"
                        variants={fadeInUp}
                        transition={{ delay: 0.2 }}
                    >
                        {t('subheading')}
                    </motion.p>
                    <motion.div
                        variants={fadeInUp}
                        transition={{ delay: 0.4 }}
                    >
                        <Button asChild>
                            <Link href="/Projects">{t('cta_button')}</Link>
                        </Button>
                    </motion.div>
                </motion.div>
                {/* Image section */}
                <motion.div
                    className="w-full lg:w-1/2 p-6 text-center"
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={isRtl ? slideInLeft : slideInRight} // Adjust animation for RTL
                >
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Image
                            src={modernBuilding}
                            alt={t('image_alt')}
                            loading="lazy"
                            style={{ borderRadius: '10px' }}
                        />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
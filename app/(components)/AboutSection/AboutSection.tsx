// components/AboutSection/AboutSection.tsx
'use client'; // Make it a client component

import * as motion from "motion/react-client";
import { Award,Clock,Shield } from 'lucide-react';
import Image from 'next/image';
import constructionSite from "@/public/Construction-site.jpeg";
import { useTranslations } from "next-intl"; // Import client-side translation hook
import { useLocale } from "next-intl"; // Import client-side locale hook
import { Ripple } from "@/components/ui/ripple";
const AboutSection = () => {
    const t = useTranslations('AboutSection'); // Get translations for this section
    const locale = useLocale();
    const isRtl = locale === 'ar';

    // Conditional animation based on locale
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
    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };
    const slideInRight = {
        initial: { opacity: 0, x: 60 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.7, ease: "easeOut" }
    };

    // Apply conditional flexbox class
    const flexDirectionClass = isRtl ? 'lg:flex-row-reverse' : 'lg:flex-row';

    return (
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative min-h-[700px] lg:h-[700px] py-12 lg:py-5 w-full overflow-hidden"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div
          className={`grid lg:grid-cols-2 gap-12 items-center ${flexDirectionClass} lg:py-40`}
        >
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={isRtl ? slideInRight : slideInLeft} // Adjust animation for RTL
          >
            <motion.h2
              className="text-3xl sm:text-5xl md:text-7xl font-serif font-bold leading-tight bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, #FDE68A 0%, #D97706 45%, #B45309 55%, #78350F 100%)",
                fontFamily: "serif",
              }}
              variants={fadeInUp}
            >
              {t("title")}
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 mb-8"
              variants={fadeInUp}
              transition={{ delay: 0.1 }}
            >
              {t("description")}
            </motion.p>
            <motion.div className="space-y-6" variants={staggerContainer}>
              <motion.div
                className="flex items-start space-x-4"
                variants={fadeInUp}
                transition={{ delay: 0.2 }}
              >
                <Award className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {t("quality_heading")}
                  </h3>
                  <p className="text-gray-600">{t("quality_description")}</p>
                </div>
              </motion.div>
              <motion.div
                className="flex items-start space-x-4"
                variants={fadeInUp}
                transition={{ delay: 0.3 }}
              >
                <Clock className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {t("delivery_heading")}
                  </h3>
                  <p className="text-gray-600">{t("delivery_description")}</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start space-x-4"
                variants={fadeInUp}
                transition={{ delay: 0.4 }}
              >
                <Shield className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {t("safety_heading")}
                  </h3>
                  <p className="text-gray-600">{t("safety_description")}</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
          <motion.div
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
                src={constructionSite}
                alt={t("image_alt")}
                loading="lazy"
                style={{
                  borderRadius: "1rem",
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
                  width: "100%",
                  height: "24rem",
                }}
              />
            </motion.div>
          </motion.div>
        </div>
        <Ripple rippleColor="#D97706" />
      </div>
    );
}
export default AboutSection;
// app/Contact/page.tsx
"use client";
import React from "react";
import Hero from "@components/PagesHero/PagesHero";
import Transition from "@components/Transition/Transition";
import * as motion from "motion/react-client";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import ContentCard from "@components/ContactCard/ContactCard";
import Head from "next/head";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

const Page = () => {
  const t = useTranslations("ContactPage");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const slideInRight = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7, ease: "easeOut" },
  };
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };
  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <Transition>
      <Head>
        <title>{t("page_title")}</title>
        <meta name="description" content={t("meta_description")} />
        <meta name="robots" content="index, follow" />
      </Head>
      <div className="min-h-screen bg-white" dir={isRtl ? "rtl" : "ltr"}>
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100">
          <Hero title={t("hero_title")} description={t("hero_description")} />
        </section>
        <section>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4448.409057351145!2d31.447713099999998!3d30.2255309!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14581bcc8d981fa1%3A0x4bd1ae724e049427!2sEl%20Qasr%20Developments!5e1!3m2!1sen!2seg!4v1767265873615!5m2!1sen!2seg"
            className="w-full h-200"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </section>
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={slideInRight}
            >
              <motion.h2
                className="text-4xl font-bold mb-6 text-gray-900"
                variants={fadeInUp}
              >
                {t("social_media_title")}
              </motion.h2>
              <motion.p
                className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
                variants={fadeInUp}
              >
                {t("social_media_description")}
              </motion.p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center">
                <a
                  href="https://www.facebook.com/elqasr123?locale=ar_AR"
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center"
                >
                  <Facebook className="w-16 h-16 text-blue-600 mb-4" />
                  <span className="text-gray-700 text-lg">
                    {t("facebook_link")}
                  </span>
                </a>

                <a
                  href="https://www.instagram.com/elqasr_development/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center"
                >
                  <Instagram className="w-16 h-16 text-blue-600 mb-4" />
                  <span className="text-gray-700 text-lg">
                    {t("instagram_link")}
                  </span>
                </a>
              </div>
            </motion.div>
          </div>
        </section>
        <section>
          <iframe
            src={process.env.NEXT_PUBLIC_CONTACT_FORM_URL}
            className="w-full h-[700px] rounded-lg border shadow-sm"
            loading="lazy"
          />
        </section>
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={slideInRight}
            >
              <motion.h2
                className="text-4xl font-bold mb-6 text-gray-900"
                variants={fadeInUp}
              >
                {t("others_title")}
              </motion.h2>
            </motion.div>
            <motion.div
              className="grid lg:grid-cols-3 gap-8"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <ContentCard
                Title={t("call_us.title")}
                Description={t("call_us.description")}
                Content={t("call_us.content")}
                icon={
                  <Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                }
              />
              <ContentCard
                Title={t("email_us.title")}
                Description={t("email_us.description")}
                Content={t("email_us.content")}
                icon={<Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />}
                Delay={0.5}
              />
              <ContentCard
                Title={t("visit_us.title")}
                Description={t("visit_us.description")}
                Content={t("visit_us.content")}
                icon={
                  <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                }
                Delay={1}
              />
            </motion.div>
          </div>
        </section>
      </div>
    </Transition>
  );
};
export default Page;

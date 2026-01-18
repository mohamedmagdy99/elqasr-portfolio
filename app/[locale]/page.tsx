import HeroSlider from "../(components)/HeroSlider/HeroSlider";
import Stats from "@components/Stats/Stats";
import Projects from "@components/FeaturedProjectsWrapper/FeaturedProjectsWrapper";
import About from "@components/AboutSection/AboutSection";
import Gallery from "@components/Gallery/Gallery";
import Contact from "@components/ContactSection/ContactSection";
import { getLocale, getTranslations } from "next-intl/server";
import * as motion from "motion/react-client";
import OldProjects from "@components/OldProjects/OldProjects";

export default async function Home() {
  const locale = await getLocale();
  const isRtl = locale === "ar";
  const t = await getTranslations("Home");
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
    <div dir={isRtl ? "rtl" : "ltr"} className="overflow-x-hidden">
      <title>{t("page_title")}</title>
      <meta name="description" content={t("page_description")} />
      <meta name="robots" content="index, follow" />
      <meta property="og:title" content={t("og_title")} />
      <meta property="og:type" content="website" />
      <meta property="og:description" content={t("og_description")} />
      <meta
        property="og:image"
        content="https://realestate-gallery.s3.eu-central-1.amazonaws.com/projects/elqasr-logo.png"
      />
      <meta property="og:url" content="https://elqasr-development.com" />
      <meta name="twitter:card" content="summary_large_image" />

      <section>
        <HeroSlider />
      </section>
      <motion.section
        className=" relative overflow-hidden"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <Stats />
      </motion.section>
      <motion.div
        variants={fadeInUp}
        className="flex items-center justify-center gap-6 mb-10 opacity-100 mt-20"
      >
        <div className="w-96 h-1 bg-gradient-to-r from-transparent to-amber-500" />
        <div className="w-3 h-3 rotate-45 border-2 border-amber-500" />
        <div className="w-96 h-1 bg-gradient-to-l from-transparent to-amber-500" />
      </motion.div>
      <section id="Projects" className="py-20">
        <Projects />
      </section>
      
      <section id="old_Projects">
        <OldProjects />
      </section>
      <motion.div
        variants={fadeInUp}
        className="flex items-center justify-center gap-6 mb-10 opacity-100 mt-5"
      >
        <div className="w-96 h-1 bg-gradient-to-r from-transparent to-amber-500" />
        <div className="w-3 h-3 rotate-45 border-2 border-amber-500" />
        <div className="w-96 h-1 bg-gradient-to-l from-transparent to-amber-500" />
      </motion.div>
      <section id="about" >
        <About />
      </section>
      <motion.div
        variants={fadeInUp}
        className="flex items-center justify-center gap-6 mb-10 opacity-100 mt-20"
      >
        <div className="w-96 h-1 bg-gradient-to-r from-transparent to-amber-500" />
        <div className="w-3 h-3 rotate-45 border-2 border-amber-500" />
        <div className="w-96 h-1 bg-gradient-to-l from-transparent to-amber-500" />
      </motion.div>
      <section>
        <Gallery />
      </section>
      <motion.div
        variants={fadeInUp}
        className="flex items-center justify-center gap-6 mb-10 opacity-100 mt-20"
      >
        <div className="w-96 h-1 bg-gradient-to-r from-transparent to-amber-500" />
        <div className="w-3 h-3 rotate-45 border-2 border-amber-500" />
        <div className="w-96 h-1 bg-gradient-to-l from-transparent to-amber-500" />
      </motion.div>
      <section>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4448.409057351145!2d31.447713099999998!3d30.2255309!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14581bcc8d981fa1%3A0x4bd1ae724e049427!2sEl%20Qasr%20Developments!5e1!3m2!1sen!2seg!4v1767265873615!5m2!1sen!2seg"
          className="w-full h-200"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
      <motion.div
        variants={fadeInUp}
        className="flex items-center justify-center gap-6 mb-10 opacity-100 mt-20"
      >
        <div className="w-96 h-1 bg-gradient-to-r from-transparent to-amber-500" />
        <div className="w-3 h-3 rotate-45 border-2 border-amber-500" />
        <div className="w-96 h-1 bg-gradient-to-l from-transparent to-amber-500" />
      </motion.div>
      <section>
        <iframe
          src={process.env.NEXT_PUBLIC_CONTACT_FORM_URL}
          className="w-full h-[700px] rounded-lg border shadow-sm"
          loading="lazy"
        />
      </section>
      <motion.div
        variants={fadeInUp}
        className="flex items-center justify-center gap-6 mb-10 opacity-100 mt-20"
      >
        <div className="w-96 h-1 bg-gradient-to-r from-transparent to-amber-500" />
        <div className="w-3 h-3 rotate-45 border-2 border-amber-500" />
        <div className="w-96 h-1 bg-gradient-to-l from-transparent to-amber-500" />
      </motion.div>
      <section id="contact" className="py-20 bg-gray-50">
        <Contact />
      </section>
    </div>
  );
}

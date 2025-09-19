import Hero from '@components/Hero/Hero';
import Stats from '@components/Stats/Stats';
import Projects from '@components/FeaturedProjectsWrapper/FeaturedProjectsWrapper';
import About from '@components/AboutSection/AboutSection';
import Gallery from '@components/Gallery/Gallery';
import Contact from '@components/ContactSection/ContactSection';
import { getLocale, getTranslations } from 'next-intl/server';
import * as motion from "motion/react-client";

export default async function Home() {
    const locale = await getLocale();
    const isRtl = locale === 'ar';
    const t = await getTranslations('Home');

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'}>
            <title>{t('page_title')}</title>
            <meta
                name="description"
                content={t('page_description')}
            />
            <meta name="robots" content="index, follow" />
            <meta property="og:title" content={t('og_title')} />
            <meta property="og:description" content={t('og_description')} />
            <meta property="og:image" content="https://realestate-gallery.s3.eu-central-1.amazonaws.com/projects/elqasr-logo.png" />
            <meta property="og:url" content="https://elqasr-development.com" />
            <meta name="twitter:card" content="summary_large_image" />

            <section className=" bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
                <Hero />
            </section>
            <motion.section
                className="py-16 bg-gray-50"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
            >
                <Stats/>
            </motion.section>
            <section id="Projects" className="py-20">
                <Projects/>
            </section>
            <section id="about" className="py-20 bg-gray-50">
                <About/>
            </section>
            <section>
                <Gallery/>
            </section>
            <section id="contact" className="py-20 bg-gray-50" >
                <Contact/>
            </section>
        </div>
    );
}
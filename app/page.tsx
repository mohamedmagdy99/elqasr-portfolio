import Hero from '@components/Hero/Hero';
import Stats from '@components/Stats/Stats';
import Projects from '@components/FeaturedProjectsWrapper/FeaturedProjectsWrapper';
import About from '@components/AboutSection/AboutSection';
import Gallery from '@components/Gallery/Gallery';
import Contact from '@components/ContactSection/ContactSection';
import Head from 'next/head';

import * as motion from "motion/react-client";
export default   function Home() {
    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
    <>
        <Head>
            <title>El Qasr Development | Home</title>
            <meta
                name="description"
                content="El Qasr Development provides premium residential and commercial projects in Egypt."
            />
            <meta name="robots" content="index, follow" />
            <meta name="robots" content="index, follow" />
            <meta property="og:title" content="El Qasr Development" />
            <meta property="og:description" content="Premium residential and commercial projects in Egypt." />
            <meta property="og:image" content="https://realestate-gallery.s3.eu-central-1.amazonaws.com/projects/1757505764687-%C3%98%C2%A7%C3%99%C2%84%C3%99%C2%82%C3%98%C2%B5%C3%98%C2%B1+copy.png" />
            <meta property="og:url" content="https://elqasr-development.com" />
            <meta name="twitter:card" content="summary_large_image" />
        </Head>
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
        <section >
            <Gallery/>
        </section>
        <section id="contact" className="py-20 bg-gray-50" >
            <Contact/>
        </section>
    </>
  );
}

import Navbar from '@components/Navbar/Navbar';
import Hero from '@components/Hero/Hero';
import Stats from '@components/Stats/Stats';
import Projects from '@components/FeaturedProjects/FeaturedProjects';
import About from '@components/AboutSection/AboutSection';
import Gallery from '@components/Gallery/Gallery';
import Contact from '@components/ContactSection/ContactSection';
import Footer from '@components/Footer/Footer';

import * as motion from "motion/react-client";
export default function Home() {
    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };
    const fadeIn = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.8, ease: "easeOut" }
    };


    return (
    <>
        <nav className="sticky top-0 bg-white shadow-sm md:border-b border-gray-300 z-50">
            <Navbar />
        </nav>

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
      <motion.footer
          className="bg-gray-900 text-white py-12"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeIn}
      >
        <Footer />
      </motion.footer>
    </>
  );
}

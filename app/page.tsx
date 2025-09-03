import Navbar from '@components/Navbar/Navbar';
import Hero from '@components/Hero/Hero';
import Stats from '@components/Stats/Stats';

import * as motion from "motion/react-client";
export default function Home() {
    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
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
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

      </footer>
    </>
  );
}

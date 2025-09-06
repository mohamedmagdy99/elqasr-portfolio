import React from 'react'
import Hero from '@components/PagesHero/PagesHero';
import Transition from "@components/Transition/Transition";
import * as motion from "motion/react-client";
import {Facebook, Instagram, Mail, MapPin, Phone} from 'lucide-react';
import ContentCard from "@components/ContactCard/ContactCard";

const Page = () => {
    const slideInRight = {
        initial: { opacity: 0, x: 60 },
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

    return (
        <Transition>
            <div className="min-h-screen bg-white">
                <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
                    <Hero title="Contact Us" description="Reach out today to explore Alqasr real estate solutions tailored to your goals — whether you're investing, developing, or searching for your next signature property."/>
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
                            <motion.h2 className="text-4xl font-bold mb-6 text-gray-900" variants={fadeInUp}>Our Social Media</motion.h2>
                            <motion.p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8" variants={fadeInUp}>
                                Follow us on social media to stay up to date with the latest news and developments.
                            </motion.p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center">
                                <a
                                    href="https://www.facebook.com/elqasr123?locale=ar_AR"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex flex-col items-center"
                                >
                                    <Facebook className="w-16 h-16 text-blue-600 mb-4" />
                                    <span className="text-gray-700 text-lg">Facebook</span>
                                </a>

                                <a
                                    href="https://www.instagram.com/elqasr_development/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex flex-col items-center"
                                >
                                    <Instagram className="w-16 h-16 text-blue-600 mb-4" />
                                    <span className="text-gray-700 text-lg">Instagram</span>
                                </a>
                            </div>

                        </motion.div>
                    </div>
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
                            <motion.h2 className="text-4xl font-bold mb-6 text-gray-900" variants={fadeInUp}>Others</motion.h2>
                        </motion.div>
                        <motion.div
                            className="grid lg:grid-cols-3 gap-8"
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                        >
                            <ContentCard Title="Call Us" Description="Sat-Fri: 10AM-9PM" Content="+20 1117073033" icon={<Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />} />
                            <ContentCard Title="Email Us" Description="We'll respond within 24 hours" Content="Elqasrdevelopment@gmail.com" icon={<Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />} Delay={0.5} />
                            <ContentCard Title="Visit Us" Description="Sat-Fri: 10AM-9PM" Content="Saqafa Street, Obour City, Cairo, Egypt" icon={<MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />} Delay={1} />
                        </motion.div>
                    </div>
                </section>
            </div>
        </Transition>
    )
}
export default Page

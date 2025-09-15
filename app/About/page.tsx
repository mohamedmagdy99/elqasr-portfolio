"use client";
import * as motion from "motion/react-client";
import Image from "next/image";
import { useRouter } from 'next/navigation';

import Construction from "../../public/Construction-site.jpeg"
import Transition from "@components/Transition/Transition";
import ContentCard from '@components/ContactCard/ContactCard';
import Hero from '@components/PagesHero/PagesHero';

import {  Target, Eye, Heart,Phone } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Head from "next/head";
import React from "react";

const Page = () => {
    const router = useRouter();
    const onNavigate = (path: string) => {
        router.push(`/${path}`);
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    const slideInLeft = {
        initial: { opacity: 0, x: -60 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.7, ease: "easeOut" }
    };

    const slideInRight = {
        initial: { opacity: 0, x: 60 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.7, ease: "easeOut" }
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
            <Head>
                <title>El Qasr Development | About Us</title>
                <meta
                    name="description"
                    content="El Qasr Development provides premium residential and commercial projects in Egypt."
                />
                <meta name="robots" content="index, follow" />
            </Head>
            <div className="min-h-screen bg-white">
                <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
                    <Hero title="About Alqasr RealEstate" description="Building tomorrow's infrastructure with over 5 years of expertise, innovation, and unwavering commitment to excellence."/>
                </section>
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial="initial"
                                whileInView="animate"
                                viewport={{ once: true }}
                                variants={slideInLeft}
                            >
                                <motion.h2
                                    className="text-4xl font-bold text-gray-900 mb-6"
                                    variants={fadeInUp}
                                >
                                    Our Story
                                </motion.h2>
                                <motion.div
                                    className="space-y-4 text-lg text-gray-600"
                                    variants={staggerContainer}
                                >
                                    <motion.p variants={fadeInUp}>
                                        Alqasr Real Estate Development is one of Egypt’s leading companies in the field of real estate investment and development. The company was founded with a clear vision: to deliver integrated projects that combine quality and innovation, meeting the needs of clients across residential, commercial, and investment sectors.
                                    </motion.p>
                                    <motion.p variants={fadeInUp}>
                                        As a prominent developer in Egypt, Alqasr specializes in residential, commercial, and administrative projects in Obour City and New Cairo. We prioritize strategic locations, modern architectural designs, and flexible payment plans tailored to suit every client.
                                    </motion.p>
                                    <motion.p variants={fadeInUp}>
                                        Today, {"we're"} proud to be one of the most trusted construction companies in Egypt, with over 50 completed projects and a reputation built on excellence, reliability and customer satisfaction.
                                    </motion.p>
                                </motion.div>
                            </motion.div>
                            <motion.div
                                initial="initial"
                                whileInView="animate"
                                viewport={{ once: true }}
                                variants={slideInRight}
                            >
                                <motion.div
                                    whileHover={{scale: 1.02}}
                                    transition={{duration: 0.3}}
                                >
                                    <Image src={Construction} alt="Contsruction site" style={{ borderRadius: '1rem', boxShadow:'0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)', width:"100%", height:"24rem"}}/>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </section>
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            className="text-center mb-16"
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Foundation</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">The principles that guide everything we do</p>
                        </motion.div>
                        <motion.div
                            className="grid lg:grid-cols-3 gap-8"
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                        >
                            <ContentCard Title="Our Mission" icon={<Target className="w-16 h-16 text-blue-600 mx-auto mb-4"/>} Content="To deliver exceptional construction projects that exceed our clients' expectations while contributing to the development of sustainable, beautiful, and functional communities." />
                            <ContentCard Title="Our Vision" Content="To be the leading construction company that shapes the future of urban development through innovation, sustainability, and uncompromising quality." icon={<Eye className="w-16 h-16 text-blue-600 mx-auto mb-4" />} Delay={0.5} />
                            <ContentCard Title="Our Values" Content="Integrity, excellence, innovation and safety guide every decision we make and every project we undertake." icon={<Heart className="w-16 h-16 text-blue-600 mx-auto mb-4" />} Delay={1} />
                        </motion.div>
                    </div>
                </section>
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            className="text-center"
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Let’s Build Value, Not Just Property</h2>
                            <p className="text-xl text-gray-600 mb-8 max-x-2xl mx-auto">From landmark developments to exclusive residences, we specialize in turning real estate visions into high-return realities. Partner with a team that understands the market, the luxury, and the long game.</p>
                            <div className="flex sm:flex-row flex-col gap-4 justify-center">
                                <Button
                                    size="lg"
                                    onClick={() => onNavigate('Contact')}
                                    className="text-lg px-8 py-6"
                                >
                                    <Phone className="w-5 h-5 mr-2" />
                                    Contact Us Today
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => onNavigate('Projects')}
                                    className="text-lg px-8 py-6"
                                >
                                    View Our Projects
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </Transition>
    )
}
export default Page

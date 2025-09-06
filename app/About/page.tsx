"use client";
import * as motion from "motion/react-client";
import Image from "next/image";
import { useRouter } from 'next/navigation';

import logo from "../../public/elqasr-logo.png"
import Construction from "../../public/Construction-site.jpeg"
import Transition from "@components/Transition/Transition";
import ContentCard from '@components/ContactCard/ContactCard';

import {  Target, Eye, Heart,Phone } from 'lucide-react';
import { Button } from "@/components/ui/button";

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
            <div className="min-h-screen bg-white">
                <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
                    <div className="max-w-7xl px-4 mx-auto sm:px-6 lg:px-8">
                        <motion.div
                            className="text-center"
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <motion.div
                                className="flex items-center justify-center space-x-2 mb-6"
                                variants={fadeInUp}
                            >
                                <Image src={logo} alt="Alqasr Logo"  style={{ width: "15rem", height: "15rem"}} />
                            </motion.div>
                            <motion.h1
                                className="text-4xl font-bold text-gray-900 mb-6"
                                variants={fadeInUp}
                            >
                                About Alqasr RealEstate
                            </motion.h1>
                            <motion.p
                                className="text-xl text-gray-600 max-w-3xl mx-auto"
                                variants={fadeInUp}
                                transition={{ delay: 0.1 }}
                            >
                                Building {"tomorrow's"} infrastructure with over 5 years of expertise, innovation, and unwavering commitment to excellence.
                            </motion.p>
                        </motion.div>
                    </div>
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
                                        Founded in 1999, BuildCraft began as a small residential construction company with a big vision: to redefine what it means to build with quality, integrity, and innovation.
                                    </motion.p>
                                    <motion.p variants={fadeInUp}>
                                        Over the years, {"we've"} grown from a team of 5 to over 20 skilled professionals, expanding our services to include large-scale commercial developments, luxury residential complexes.
                                    </motion.p>
                                    <motion.p variants={fadeInUp}>
                                        Today, {"we're"} proud to be one of the most trusted construction companies in Obour City, with over 50 completed projects and a reputation built on excellence, reliability, and customer satisfaction.
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
                                    onClick={() => onNavigate('contact')}
                                    className="text-lg px-8 py-6"
                                >
                                    <Phone className="w-5 h-5 mr-2" />
                                    Contact Us Today
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => onNavigate('projects')}
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

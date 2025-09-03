"use client";
import * as motion from "motion/react-client";
import  Link  from "next/link"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import modernBuilding from "@/public/modern-building-hero-section.jpg";

export default function Hero() {
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
    const slideInRight = {
        initial: { opacity: 0, x: 60 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.7, ease: "easeOut" }
    };
    return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center gap-12 justify-center py-6 ">
                    {/* Left: Text */}
                    <motion.div
                        className="w-full lg:w-1/2 p-6"
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={slideInLeft}
                    >
                        <motion.h1
                            className="text-4xl font-bold text-gray-900 mb-6"
                            variants={fadeInUp}
                        >
                            Building {"Tomorrow's"}
                            <span className="text-blue-600"> Infrastructure</span>
                        </motion.h1>
                        <motion.p
                            className="text-lg text-gray-600 mb-6"
                            variants={fadeInUp}
                            transition={{ delay: 0.2 }}
                        >
                            From luxury homes to commercial complexes, we deliver exceptional construction projects that stand the test of time.
                        </motion.p>
                        <motion.div
                            variants={fadeInUp}
                            transition={{ delay: 0.4 }}
                        >
                            <Button asChild>
                                <Link href="#">View Our Projects</Link>
                            </Button>
                        </motion.div>
                    </motion.div>
                    <motion.div
                        className="w-full lg:w-1/2 p-6 text-center"
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={slideInRight}
                    >
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Image
                                src={modernBuilding}
                                alt="Modern construction building"
                                loading="lazy"
                                style={{ borderRadius: '10px' }}
                            />
                        </motion.div>
                    </motion.div>

                </div>
            </div>
    );
}

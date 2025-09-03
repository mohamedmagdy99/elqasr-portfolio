import * as motion from "motion/react-client";
import { Award,Clock,Shield } from 'lucide-react';
import Image from 'next/image';
import constructionSite from "@/public/Construction-site.jpeg";

const AboutSection = () => {
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
    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };
    const slideInRight = {
        initial: { opacity: 0, x: 60 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.7, ease: "easeOut" }
    };
    return (
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
                        Why Choose ALQASR?
                    </motion.h2>
                    <motion.p
                        className="text-lg text-gray-600 mb-8"
                        variants={fadeInUp}
                        transition={{ delay: 0.1 }}
                    >
                        With over 5 years of experience in construction, {"we've "} built a reputation for excellence, innovation, and reliability. Our team of experts is committed to delivering projects that exceed expectations.
                    </motion.p>
                    <motion.div
                        className="space-y-6"
                        variants={staggerContainer}
                    >
                        <motion.div
                            className="flex items-start space-x-4"
                            variants={fadeInUp}
                            transition={{ delay: 0.2 }}
                        >
                            <Award className="w-6 h-6 text-blue-600 mt-1" />
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Award-Winning Quality</h3>
                                <p className="text-gray-600">Recognized for excellence in construction and design innovation.</p>
                            </div>
                        </motion.div>
                        <motion.div
                            className="flex items-start space-x-4"
                            variants={fadeInUp}
                            transition={{ delay: 0.3 }}
                        >
                            <Clock className="w-6 h-6 text-blue-600 mt-1" />
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">On-Time Delivery</h3>
                                <p className="text-gray-600">We pride ourselves on completing projects on schedule and within budget.</p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="flex items-start space-x-4"
                            variants={fadeInUp}
                            transition={{ delay: 0.4 }}
                        >
                            <Shield className="w-6 h-6 text-blue-600 mt-1" />
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Safety First</h3>
                                <p className="text-gray-600">Maintaining the highest safety standards in all our construction projects.</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
                <motion.div
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={slideInRight}
                >
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Image src={constructionSite} alt="Construction site" loading="lazy" style={{ borderRadius: '1rem', boxShadow:'0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)', width:"100%", height:"24rem"}}/>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
export default AboutSection

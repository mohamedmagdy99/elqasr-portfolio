import React from 'react'
import * as motion from "motion/react-client";
import Image from "next/image";
import logo from '../../../public/footer-logo.png'
import { Separator } from '@/components/ui/separator';
import FooterCard from '@components/FooterCard/FooterCart';


const Footer = () => {
    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };
    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    };
    const Services:string[] = ["Residential","Commercial"];
    const contact:string[] = ["+20 1117073033","Elqasrdevelopment@gmail.com","Saqafa Street,Obour City","Cairo, Egypt"];
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
                className="grid md:grid-cols-4 gap-8"
                variants={staggerContainer}
            >
                <motion.div
                    varitants={fadeInUp}
                >
                    <div className="flex items-center space-x-2 mb-4">
                        <Image src={logo} alt="Alqasr Logo" style={{ width: "2rem", height: "2rem" }} />
                        <span className="text-xl font-bold">ALQASR</span>
                    </div>
                    <p className="text-gray-400">Building {"tomorrow's"} infrastructure with excellence and innovation.</p>
                </motion.div>
                <FooterCard Title={"Services"} list={Services} />
                <FooterCard Title={"Contact"} list={contact} />
                <motion.div
                    variants={fadeInUp}
                >
                    <h3 className="font-semibold mb-4">Social</h3>
                    <ul className="space-y-2 text-gray-400">
                        <li>
                            <a href="https://www.facebook.com/elqasr123?locale=ar_AR" target="_blank" rel="noreferrer">Facebook</a>
                        </li>
                        <li>
                            <a href="https://www.instagram.com/elqasr_development/" target="_blank" rel="noreferrer">Instagram</a>
                        </li>
                    </ul>
                </motion.div>
            </motion.div>
            <Separator className="my-8 bg-gray-800" />
            <motion.div
                className="text-center text-gray-400"
                variants={{fadeInUp}}
            >
                <p>&copy; 2025 Alqasr RealState. All rights reserved.</p>
            </motion.div>
        </div>
    )
}
export default Footer

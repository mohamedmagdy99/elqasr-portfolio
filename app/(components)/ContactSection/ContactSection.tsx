import React from 'react'
import * as motion from "motion/react-client";
import ContentCard from '@components/ContactCard/ContactCard';

import { Phone,Mail,MapPin } from 'lucide-react';

const ContactSection = () => {
    const fadeIn = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.8, ease: "easeOut" }
    };
    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
                className="text-center mb-16"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeIn}
            >
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h1>
                <p className="text-xl text-gray-600">Let’s talk real estate {" — "} your next chapter starts here.</p>
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
    )
}
export default ContactSection

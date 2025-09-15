import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '@components/Navbar/Navbar';
import Footer from '@components/Footer/Footer';
import * as motion from "motion/react-client";
import {TanstackProvider } from "@/components/providers/tanstack-provider";
import NextAuthProvider from '@/components/providers/NextAuthProvider';


const geistSans = Geist({
  subsets: ["latin"],
  weight: ["400", "700"], // optional: choose weights
  style: "normal",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400"],
  style: "normal",
});

export const metadata: Metadata = {
  title: "ALQASR REAL ESTATE DEVELOPMENT",
  description: "this is an offical website for alqasr real estate development.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const fadeIn = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    };
    return (
        <html lang="en" className={`${geistSans.className} ${geistMono.className}`}>
        <head>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "El Qasr Development",
                        "url": "https://elqasr-development.com",
                        "logo": "https://realestate-gallery.s3.eu-central-1.amazonaws.com/projects/1757505764687-%C3%98%C2%A7%C3%99%C2%84%C3%99%C2%82%C3%98%C2%B5%C3%98%C2%B1+copy.png"
                    })
                }}
            />
        </head>
        <body className="antialiased">
        <TanstackProvider dehydratedState={undefined}>
            <NextAuthProvider>
                {/* ✅ Navbar now inside SessionProvider */}
                <nav className="sticky top-0 bg-white shadow-sm md:border-b border-gray-300 z-50">
                    <Navbar />
                </nav>

                {/* ✅ Page content */}
                {children}

                {/* ✅ Footer also inside provider */}
                <motion.footer
                    className="bg-gray-900 text-white py-12"
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={fadeIn}
                >
                    <Footer />
                </motion.footer>
            </NextAuthProvider>
        </TanstackProvider>
        </body>
        </html>
    );
}


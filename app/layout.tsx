import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '@components/Navbar/Navbar';
import Footer from '@components/Footer/Footer';
import * as motion from "motion/react-client";


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
  title: "ALQASR REAL STATE DEVELOPMENT",
  description: "this is an offical website for alqasr real state development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const fadeIn = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    return (
        <html lang="en" className={`${geistSans.className} ${geistMono.className}`}>
            <body className="antialiased">
            <nav className="sticky top-0 bg-white shadow-sm md:border-b border-gray-300 z-50">
                <Navbar />
            </nav>

            <main>{children}</main>

            <motion.footer
                className="bg-gray-900 text-white py-12"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeIn}
            >
                <Footer />
            </motion.footer>
            </body>
        </html>

    );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  return (
      <html lang="en" className={`${geistSans.className} ${geistMono.className}`}>
      <body className={`antialiased`}>
      {children}
      </body>
      </html>
  );
}

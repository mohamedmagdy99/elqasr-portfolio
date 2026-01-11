"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import { LogOut, Menu, X } from "lucide-react";
import LanguageSwitcher from "@components/LanguageSwitcher/LanguageSwitcher";

export default function Navbar() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const isRtl = locale === "ar";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const navbarVariant = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut, staggerChildren: 0.1 },
    },
  };

  const mobileMenuVariants = {
    hidden: { x: isRtl ? "-100%" : "100%", transition: { type: "tween" } },
    visible: {
      x: "0%",
      transition: { type: "spring", damping: 25, stiffness: 200 },
    },
  };

  // Logic: Always white on mobile. On desktop (md), toggles with scroll.
  const navClass = isScrolled
    ? "bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-slate-200"
    : "bg-white md:bg-transparent py-5 md:py-6 shadow-md md:shadow-none border-b border-slate-200 md:border-none";

  const textColorClass = isScrolled
    ? "text-slate-900"
    : "text-slate-900 md:text-white";

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[999] transition-all duration-300 ${navClass}`}
      >
        <motion.div
          className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center"
          variants={navbarVariant}
          initial="hidden"
          animate="visible"
          dir={isRtl ? "rtl" : "ltr"}
        >
          {/* Brand Identity */}
          <Link href="/" className="relative z-[1001]">
            <h1
              className="text-xl md:text-2xl font-bold leading-tight bg-clip-text text-transparent transition-transform hover:scale-105"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, #FDE68A 0%, #D97706 45%, #B45309 55%, #78350F 100%)",
                fontFamily: "serif",
              }}
            >
              {t("brand_name")}
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-8">
              {[
                { name: t("home_link"), href: "/" },
                { name: t("projects_link"), href: "/Projects" },
                { name: t("old-projects_link"), href: "/old-projects" },
                { name: t("about_link"), href: "/About" },
                { name: t("contact_link"), href: "/Contact" },
              ].map((link) => (
                <li key={link.href} className="group relative">
                  <Link
                    href={link.href}
                    className={`text-sm tracking-wide uppercase font-medium transition-colors duration-300 ${textColorClass} group-hover:text-blue-500`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}

              {/* RESTORED: Admin Desktop Section */}
              {isAdmin && (
                <div className="flex items-center gap-6 pl-6 border-l border-slate-300/50 ml-2">
                  <Link
                    href="/Admin"
                    className={`text-sm font-bold uppercase transition-colors ${textColorClass} hover:text-blue-500`}
                  >
                    {t("admin_link")}
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className={`p-2 rounded-full hover:bg-slate-100 transition-colors ${textColorClass} hover:text-red-500`}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="ml-4 p-1 rounded-lg bg-slate-100/10 backdrop-blur-sm">
                <LanguageSwitcher />
              </div>
            </ul>
          </nav>

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-100 text-slate-900 relative z-[1001]"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </motion.div>

        {/* Mobile Menu Panel */}
        <AnimatePresence mode="wait">
          {isOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] md:hidden"
                onClick={() => setIsOpen(false)}
              />

              {/* Side Panel */}
              <motion.div
                ref={menuRef}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={mobileMenuVariants}
                className={`fixed top-0 ${
                  isRtl ? "left-0" : "right-0"
                } w-[80%] max-w-sm h-screen bg-white shadow-2xl z-[1002] md:hidden overflow-y-auto`}
              >
                <div className="p-8 flex flex-col min-h-full bg-white">
                  <div className="flex items-center justify-between mb-10">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Menu
                    </span>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-slate-900 p-2"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <ul className="flex flex-col gap-8">
                    {[
                      { name: t("home_link"), href: "/" },
                      { name: t("projects_link"), href: "/Projects" },
                      { name: t("old-projects_link"), href: "/old-projects" },
                      { name: t("about_link"), href: "/About" },
                      { name: t("contact_link"), href: "/Contact" },
                    ].map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="text-2xl font-bold text-slate-900 hover:text-blue-600 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}

                    {/* RESTORED: Admin Mobile Link */}
                    {isAdmin && (
                      <li className="pt-6 border-t border-slate-100">
                        <Link
                          href="/Admin"
                          className="text-2xl font-bold text-blue-600"
                          onClick={() => setIsOpen(false)}
                        >
                          {t("admin_link")}
                        </Link>
                      </li>
                    )}
                  </ul>

                  <div className="mt-auto pt-10 border-t border-slate-100">
                    <LanguageSwitcher />
                    <button
                      onClick={() => signOut()}
                      className="mt-6 flex items-center gap-3 w-full p-4 bg-slate-100 text-slate-900 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                    >
                      <LogOut size={18} /> {t("logout_text") || "Logout"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

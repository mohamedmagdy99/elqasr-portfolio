"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAllMainProjects } from "@/server/mainProjects";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type MainProject = {
  _id: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  image: string[];
  state: "available" | "sold";
  type: "Residential" | "Commercial";
  location: { en: string; ar: string };
};

export default function OldProjects() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;

  const { data, isLoading, error, isPlaceholderData } = useQuery({
    queryKey: ["oldProjects", currentPage],
    queryFn: () =>
      getAllMainProjects({ page: currentPage, limit, state: "sold" }),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.pagination?.totalPages || 1;

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">
            {isRtl ? "جاري تحميل الروائع..." : "Loading Masterpieces..."}
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-20 py-15">
      {/* --- HEADER SECTION --- */}
      <div className="bg-white border-b border-gray-100 mb-12 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6 group"
          >
            {isRtl ? (
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            ) : (
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            )}
            {isRtl ? "العودة للرئيسية" : "Back to Home"}
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-2">
                {isRtl ? "سابقة الأعمال" : "Legacy Projects"}
              </h1>
              <p className="text-gray-500 max-w-lg">
                {isRtl
                  ? "استكشف مجموعتنا المنسقة من المشاريع المكتملة التي تجسد التزامنا بالتميز."
                  : "Explore our curated collection of completed projects that embody our commitment to excellence."}
              </p>
            </div>
            <div className="text-sm font-medium px-4 py-2 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
              {data?.count || 0} {isRtl ? "مشروع مكتمل" : "Completed Projects"}
            </div>
          </div>
        </div>
      </div>

      {/* --- PROJECTS GRID --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {data?.data?.map((project: MainProject) => (
              <div
                key={project._id}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={project.image?.[0] || "/placeholder.jpg"}
                    alt={project.title[locale as "en" | "ar"]}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-gray-900 px-4 py-1 rounded-full text-xs font-bold shadow-sm">
                    {isRtl ? "تم التسليم" : "Delivered"}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-white">
                    <MapPin size={16} className="text-amber-400" />
                    <span className="text-xs font-medium truncate">
                      {project.location[locale as "en" | "ar"]}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 size={14} className="text-blue-600" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                      {project.type}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {project.title[locale as "en" | "ar"]}
                  </h2>
                  <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed flex-grow">
                    {project.description[locale as "en" | "ar"]}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* --- PAGINATION --- */}
        <div className="mt-20 flex flex-col items-center gap-6">
          <div
            className="flex items-center bg-white p-2 rounded-2xl shadow-sm border border-gray-100 gap-2"
            dir="ltr"
          >
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl hover:bg-blue-50 hover:text-blue-600"
              disabled={currentPage === 1 || isPlaceholderData}
              onClick={() => {
                setCurrentPage((old) => Math.max(old - 1, 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex gap-1 px-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentPage(i + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={isPlaceholderData}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                      : "text-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl hover:bg-blue-50 hover:text-blue-600"
              disabled={currentPage === totalPages || isPlaceholderData}
              onClick={() => {
                setCurrentPage((old) => old + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <span>{isRtl ? "صفحة" : "Page"}</span>
            <span className="text-blue-600">{currentPage}</span>
            <span>/</span>
            <span>{totalPages}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

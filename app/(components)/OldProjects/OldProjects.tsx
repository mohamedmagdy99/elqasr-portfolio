"use client";
import { useState } from "react";
import { useLocale } from "next-intl";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAllMainProjects } from "@/server/mainProjects";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  History,
} from "lucide-react";
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
  const { data, isLoading, error } = useQuery({
    queryKey: ["oldProjects"],
    queryFn: async () =>
      getAllMainProjects({
        page: 1,
        limit: 6,
        state: "sold",
      }),
  });
  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 animate-pulse">
            {isRtl ? "جاري تحميل السجلات..." : "Loading history..."}
          </p>
        </div>
      </div>
    );
  if (error)
    return (
      <div>
        {isRtl
          ? "حدث خطأ أثناء تحميل تحميل مشاريع سابفة الأعمال."
          : "Error loading old projects."}
      </div>
    );
  return (
    <div className="min-h-screen  pb-6">
      <div className="bg-white  py-12 mb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2">
          <div className="flex flex-col items-center justify-center text-center gap-6">
            <div>
              <div className="flex items-center justify-center gap-3 mb-2">
                <h1 className="text-4xl font-serif font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-amber-200 via-amber-600 to-amber-900">
                  {isRtl ? "سابقة الأعمال" : "Past Masterpieces"}
                </h1>
              </div>

              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                {isRtl
                  ? "مجموعة فخورة من المشاريع التي تم تسليمها بنجاح، تعكس التزامنا بالجودة."
                  : "A proud collection of successfully delivered projects, reflecting our commitment to quality."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {data?.data?.map((project: MainProject) => (
              <motion.div
                whileHover={{ y: -5 }}
                key={project._id}
                className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={project.image?.[0] || "/placeholder.jpg"}
                    alt={project.title[locale as "en" | "ar"]}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute top-4 right-4 backdrop-blur-md bg-gray-950/20 border border-white/30 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {isRtl ? "تم التسليم" : "Delivered"}
                  </div>

                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white/90">
                    <MapPin size={16} className="text-amber-400" />
                    <span className="text-sm font-medium">
                      {project.location[locale as "en" | "ar"]}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <span className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-2 block">
                    {project.type}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {project.title[locale as "en" | "ar"]}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">
                    {project.description[locale as "en" | "ar"]}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        <div className="mt-16 text-center">
          <Link
            href="/old-projects"
            className="bg-amber-600 hover:bg-amber-700 text-white text-lg px-10 py-4 rounded-full shadow-xl transition-all hover:scale-105"
          >
            {isRtl ? "مشاهدة جميع المشاريع" : "View All Old Projects"}
          </Link>
        </div>
      </div>
    </div>
  );
}

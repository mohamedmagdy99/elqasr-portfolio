"use client";

import { useEffect, useState } from "react";
import { motion, type PanInfo } from "framer-motion";import { useLocale } from "next-intl";
import Image from "next/image";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllMainProjects } from "@/server/mainProjects";
import Link from "next/link";

type MainProject = {
  _id: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  image: string[];
  state: "available" | "sold";
  type: "Residential" | "Commercial";
  location: { en: string; ar: string };
};

const AUTOPLAY_DELAY = 7000;

export default function HeroSlider() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [page] = useState(1); // SetPage removed if not used to avoid unused-var warning
  const [index, setIndex] = useState(0);

  /* ---------------- Fetch Data ---------------- */
  const { data, isLoading } = useQuery({
    queryKey: ["main-projects", page],
    queryFn: () =>
      getAllMainProjects({
        page,
        limit: 9,
        state: "available",
      }),
    placeholderData: keepPreviousData,
  });

  const projects: MainProject[] = data?.data || [];

  /* ---------------- Autoplay ---------------- */
  useEffect(() => {
    if (projects.length <= 1) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % projects.length),
      AUTOPLAY_DELAY
    );
    return () => clearInterval(timer);
  }, [projects.length]);

  /**
   * FIX: Replaced 'any' with MouseEvent/PointerEvent/TouchEvent
   * and PanInfo from framer-motion.
   */
const handleDragEnd = (
  _event: unknown,
  info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }
) => {
  if (Math.abs(info.offset.x) > 100) {
    setIndex((i) =>
      info.offset.x < 0
        ? (i + 1) % projects.length
        : (i - 1 + projects.length) % projects.length
    );
  }
};

  if (isLoading)
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );
  if (!projects.length) return null;

  return (
    <section
      className="relative h-screen overflow-hidden bg-black"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* SLIDER */}
      <motion.div
        className="flex h-full"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        animate={{ x: isRtl ? `${index * 100}%` : `-${index * 100}%` }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        {projects.map((project, i) => {
          const title = isRtl ? project.title.ar : project.title.en;
          const desc = isRtl ? project.description.ar : project.description.en;

          return (
            <div
              key={project._id}
              className="relative w-full h-full flex-shrink-0"
            >
              <Image
                src={project.image?.[0] || "/basic-placeholder.jpg"}
                alt={title}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover select-none"
                draggable={false}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div
                className={`absolute bottom-10 md:bottom-16 max-w-xl px-6 md:px-12 space-y-4
                ${isRtl ? "right-0 text-right" : "left-0 text-left"}`}
              >
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-3xl md:text-6xl font-serif font-bold text-amber-400"
                >
                  {title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm md:text-lg text-slate-300 leading-relaxed"
                >
                  {desc}
                </motion.p>

                <div
                  className={`flex gap-4 pt-4 ${
                    isRtl ? "flex-row-reverse" : ""
                  }`}
                >
                  <Link
                    href="/Contact"
                    className="px-6 py-3 rounded-full bg-amber-600 text-white font-semibold hover:bg-amber-700 transition"
                  >
                    {isRtl ? "تواصل معنا" : "Contact Us"}
                  </Link>

                  <Link
                    href={`/main-project/${project._id}`}
                    className="px-6 py-3 rounded-full border border-amber-400 text-amber-400 hover:bg-amber-400/10 transition"
                  >
                    {isRtl ? "عرض التفاصيل" : "View Details"}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Pagination */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {/* FIX: Replaced 'any' with 'MainProject' */}
        {projects.map((_: MainProject, i: number) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-10 bg-amber-500" : "w-2 bg-white/40"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

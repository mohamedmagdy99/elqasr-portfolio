"use client";

import { useQuery } from "@tanstack/react-query";
import * as motion from "motion/react-client";
import { ProjectCard } from "@components/ProjectCard/ProjectCard";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { getAllProjects } from "@/server/Projects";
import React, { useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

// ---- Types ----
type LocalizedString = {
  en: string;
  ar: string;
};

type Project = {
  _id: string;
  title: LocalizedString;
  description: LocalizedString;
  status: LocalizedString;
  location: LocalizedString;
  type: "Residential" | "Commercial";
  image: string[];
};

type ProjectFromApi = {
  _id: string;
  title: string; // JSON string or raw string
  description: string;
  status: string;
  location: string;
  type?: "Residential" | "Commercial";
  image: string[];
};

const FeaturedProjects = () => {
  const router = useRouter();
  const locale = useLocale();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["project", "featured"],
    queryFn: () => getAllProjects({ page: 1, limit: 3 }),
    staleTime: 1000 * 60 * 50,
  });

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const processedProjects = useMemo(() => {
    // Cast the raw query data to the expected API response structure
    const rawData = (data as { data: ProjectFromApi[] })?.data || [];

    return rawData.map((p: ProjectFromApi): Project => {
      const safeParse = (val: string): LocalizedString => {
        if (typeof val !== "string") return val;
        try {
          return JSON.parse(val);
        } catch {
          // Fallback if the string isn't valid JSON
          return { en: val, ar: val };
        }
      };

      return {
        _id: p._id,
        title: safeParse(p.title),
        description: safeParse(p.description),
        location: safeParse(p.location),
        status: safeParse(p.status),
        type: p.type || "Residential",
        image: Array.isArray(p.image) ? p.image : [],
      };
    });
  }, [data]);

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-500">
        <AlertCircle size={48} className="mb-4" />
        <p className="text-lg font-medium">
          {locale === "en"
            ? "Failed to load projects"
            : "فشل في تحميل المشاريع"}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white">
      <motion.div
        className="text-center mb-16"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <h2 className="text-4xl sm:text-6xl font-serif font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-amber-200 via-amber-600 to-amber-900">
          {locale === "en" ? "Our Featured Projects" : "مشاريعنا المميزة"}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {locale === "en"
            ? "Explore our portfolio of exceptional construction projects."
            : "استكشف مشاريعنا الاستثنائية في مجال البناء"}
        </p>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner className="text-amber-600" size={48} />
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {processedProjects.map((project: Project) => (
            <motion.div key={project._id} variants={fadeInUp}>
              <ProjectCard {...project} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {!isLoading && (
        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <button
            onClick={() => router.push(`/Projects/`)}
            className="bg-amber-600 hover:bg-amber-700 text-white text-lg px-10 py-4 rounded-full shadow-xl transition-all hover:scale-105"
          >
            {locale === "ar" ? "عرض جميع المشاريع" : "View All Projects"}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default FeaturedProjects;

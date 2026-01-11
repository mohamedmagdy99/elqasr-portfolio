// app/Projects/page.tsx
'use client';
import {motion,AnimatePresence } from 'framer-motion';
import Transition from "@components/Transition/Transition";
import Hero from '@components/PagesHero/PagesHero';
import { useState } from 'react';
import { useQuery,keepPreviousData  } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import {FilterButton} from '@components/FilterButton/FilterButton';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { getAllMainProjects } from '@/server/mainProjects';
import {MainProjectCard} from '@components/MainProjectCard/MainProjectCard';

type ProjectType = "Residential" | "Commercial";
interface Project {
  _id: string;
  title: { en: string; ar: string };
  type: "Residential" | "Commercial";
  description: { en: string; ar: string };
  image: string[];
  state: "available" | "sold";
  location: { en: string; ar: string };
}
export default function ProjectsPage() {
  const t = useTranslations("ProjectsPage");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<ProjectType | undefined>(
    undefined
  );

  /* ---------------- Query ---------------- */
  const { data, isLoading, isError } = useQuery({
    queryKey: ["main-projects", page, typeFilter],
    queryFn: () =>
      getAllMainProjects({
        page,
        limit: 9,
        state: "available", // ✅ enforced
        type: typeFilter, // ✅ optional
      }),
    placeholderData: keepPreviousData,
  });

  /* ---------------- Handlers ---------------- */
  const handleTypeFilter = (type?: ProjectType) => {
    setPage(1);
    setTypeFilter(type);
  };

  /* ---------------- Render ---------------- */
  return (
    <Transition>
      <div className="min-h-screen bg-white" dir={isRtl ? "rtl" : "ltr"}>
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100">
          <Hero title={t("hero_title")} description={t("hero_description")} />
        </section>

        {/* Filters + Grid */}
        <section className="py-10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <FilterButton
                onClick={() => handleTypeFilter(undefined)}
                active={!typeFilter}
              >
                {t("all_filter")}
              </FilterButton>

              <FilterButton
                onClick={() => handleTypeFilter("Residential")}
                active={typeFilter === "Residential"}
              >
                {t("residential_filter")}
              </FilterButton>

              <FilterButton
                onClick={() => handleTypeFilter("Commercial")}
                active={typeFilter === "Commercial"}
              >
                {t("commercial_filter")}
              </FilterButton>
            </div>

            {/* Content */}
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[200px]">
                <Spinner size="sm" />
              </div>
            ) : isError ? (
              <div className="text-center text-red-500">{t("load_error")}</div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${page}-${typeFilter}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {data?.data.map((project: Project) => (
                    <motion.div
                      key={project._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MainProjectCard
                        _id={project._id}
                        title={project.title}
                        description={project.description}
                        image={project.image}
                        type={project.type}
                        state={project.state}
                        location={project.location}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Pagination Controls */}
            {data?.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 mt-16 pb-10"
              >
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <Button
                    variant="ghost"
                    className="rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    disabled={page === 1}
                    onClick={() => {
                      setPage((p) => Math.max(p - 1, 1));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    {isRtl ? "السابق" : "Previous"}
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1 mx-2">
                    {Array.from(
                      { length: data.totalPages },
                      (_, i) => i + 1
                    ).map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          setPage(num);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`w-10 h-10 rounded-full text-sm font-semibold transition-all ${
                          page === num
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                            : "text-slate-500 hover:bg-slate-100"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <Button
                    variant="ghost"
                    className="rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    disabled={page === data.totalPages}
                    onClick={() => {
                      setPage((p) => Math.min(p + 1, data.totalPages));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    {isRtl ? "التالي" : "Next"}
                  </Button>
                </div>

                {/* Page Status Indicator */}
                <span className="text-xs text-slate-400 font-medium tracking-widest uppercase">
                  {t("page_indicator", {
                    currentPage: data.currentPage,
                    totalPages: data.totalPages,
                  })}
                </span>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </Transition>
  );
}
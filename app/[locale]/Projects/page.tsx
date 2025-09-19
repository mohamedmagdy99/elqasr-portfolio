// app/Projects/page.tsx
'use client';
import {motion,AnimatePresence } from 'framer-motion';
import Transition from "@components/Transition/Transition";
import Hero from '@components/PagesHero/PagesHero';
import { useState } from 'react';
import { useQuery,keepPreviousData  } from '@tanstack/react-query';
import { getAllProjects } from '@/server/Projects';
import ProjectCard from '@components/ProjectCard/ProjectCard';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import {FilterButton} from '@components/FilterButton/FilterButton';
import Head from 'next/head';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
type LocalizedString = { en: string; ar: string };
type LocalizedStringArray = { en: string[]; ar: string[] };

type ProjectProps = {
    _id: string;
    title: LocalizedString;
    description: LocalizedString;
    location: LocalizedString;
    status: LocalizedString;
    type: "Residential" | "Commercial";
    completionDate?: string;
    image: string[];
    features?: LocalizedStringArray;
};


const Page = () => {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<{ status?: string; type?: string }>({});
    const t = useTranslations('ProjectsPage');
    const locale = useLocale();
    const isRtl = locale === 'ar';

    const isActive = (key: keyof typeof filters, value: string) => filters[key] === value;
    const { data, isLoading, isError } = useQuery({
        queryKey: ["projects", page, filters],
        queryFn: () => getAllProjects({ page, limit: 9, ...filters }),
        placeholderData: keepPreviousData,
    });

    const handleFilter = (key: 'status' | 'type', value?: string) => {
        setPage(1);
        setFilters(() => ({  [key]: value }));
    };


    return (
        <Transition>
            <Head>
                <title>{t('page_title')}</title>
                <meta
                    name="description"
                    content={t('meta_description')}
                />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content={t('og_title')} />
                <meta property="og:description" content={t('og_description')} />
                <meta property="og:image" content="https://realestate-gallery.s3.eu-central-1.amazonaws.com/projects/elqasr-logo.png" />
                <meta property="og:url" content="https://elqasr-development.com" />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <div className="min-h-screen bg-white" dir={isRtl ? 'rtl' : 'ltr'}>
                <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
                    <Hero title={t('hero_title')} description={t('hero_description')}/>
                </section>
                <section className="py-8 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            <FilterButton onClick={() => setFilters({})} active={Object.keys(filters).length === 0}>
                                {t('all_filter')}
                            </FilterButton>
                            <FilterButton onClick={() => handleFilter('type', 'Residential')} active={isActive('type', 'Residential')}>
                                {t('residential_filter')}
                            </FilterButton>
                            <FilterButton onClick={() => handleFilter('type', 'Commercial')} active={isActive('type', 'Commercial')}>
                                {t('commercial_filter')}
                            </FilterButton>
                            <FilterButton onClick={() => handleFilter('status', 'completed')} active={isActive('status', 'completed')}>
                                {t('completed_filter')}
                            </FilterButton>
                            <FilterButton onClick={() => handleFilter('status', 'in-progress')} active={isActive('status', 'in-progress')}>
                                {t('in_progress_filter')}
                            </FilterButton>
                            <FilterButton onClick={() => handleFilter('status', 'Planning')} active={isActive('status', 'Planning')}>
                                {t('planning_filter')}
                            </FilterButton>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center items-center min-h-[200px]">
                                <Spinner size="sm" />
                            </div>
                        ) : isError ? (
                            <div className="text-center text-red-500">{t('load_error')}</div>
                        ) : (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={JSON.stringify(data?.data)} // ensures re-render on filter change
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4, ease: 'easeOut' }}
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    {data?.data.map((project: ProjectProps) => (
                                        <motion.div
                                            key={project._id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ProjectCard
                                                _id={project._id}
                                                title={project.title}
                                                type={project.type}
                                                description={project.description}
                                                image={project.image}
                                                status={project.status}
                                                location={project.location}
                                                completionDate={project.completionDate}
                                            />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        )}

                        {/* Pagination Controls */}
                        <motion.div
                            key={page}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex justify-center items-center gap-2 mt-10"
                        >
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === 1}
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                className="rounded-full px-4 py-1 hover:bg-gray-100 transition"
                            >
                                {t('previous_button')}
                            </Button>

                            <span className="text-sm font-medium px-3 py-1 bg-gray-100 rounded-full">
                                {t('page_indicator', { currentPage: data?.currentPage, totalPages: data?.totalPages })}
                            </span>

                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === data?.totalPages}
                                onClick={() => setPage((prev) => prev + 1)}
                                className="rounded-full px-4 py-1 hover:bg-gray-100 transition"
                            >
                                {t('next_button')}
                            </Button>
                        </motion.div>
                    </div>
                </section>
            </div>
        </Transition>
    )
}
export default Page;
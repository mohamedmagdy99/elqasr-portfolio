"use client";

import { useQuery } from "@tanstack/react-query";
import * as motion from "motion/react-client";
import {ProjectCard as Card} from "@components/ProjectCard/ProjectCard";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { getAllProjects } from "@/server/Projects";
import React from "react";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl"; // ✅ ensure you're using next-intl

// ---- Types ----
type LocalizedStringArray = {
    en: string[];
    ar: string[];
};

type Project = {
    _id: string;
    title: { en: string; ar: string };
    description: { en: string; ar: string };
    status: { en: string; ar: string };
    location: { en: string; ar: string };
    features: LocalizedStringArray; // 👈 fix here
    type: "Residential" | "Commercial";
    completionDate?: string;
    image: string[];
};
type ProjectFromApi = {
    _id: string;
    title: string;
    description: string;
    status: string;
    location: string;
    features?: string[]; // raw JSON strings
    type: "Residential" | "Commercial";
    completionDate?: string;
    image: string[];
};
const FeaturedProjects = () => {
    const router = useRouter();
    const locale = useLocale();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["project"],
        queryFn: () => getAllProjects({ page: 1, limit: 3 }),
    });

    // cast API response shape
    const typedData = data as { data: ProjectFromApi[] };

    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" },
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    if (isError) {
        return <div>Error while getting projects</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <motion.div
                className="text-center mb-16"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
            >
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    {locale==="en"?"Our Featured Projects":"مشاريعنا المميزة"}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    {locale==="en"?"Explore our portfolio of exceptional construction projects, from luxury residential developments to commercial complexes.":"اكتشف مجموعتنا من مشاريع البناء الاستثنائية، من مشاريع التطوير السكني الفاخرة إلى المجمعات التجارية"}
                </p>
            </motion.div>

            {/* Projects grid */}
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
            >
                {isLoading ? (
                    <div className="col-span-full flex justify-center items-center min-h-[200px]">
                        <Spinner className="text-blue-500" size={64} />
                    </div>
                ) : (
                    typedData.data?.map((p: ProjectFromApi, index: number) => {
                        // Parse JSON fields into UI-friendly object
                        const parsed: Project = {
                            ...p,
                            title: typeof p.title === "string" ? JSON.parse(p.title) : p.title,
                            description: typeof p.description === "string" ? JSON.parse(p.description) : p.description,
                            status: typeof p.status === "string" ? JSON.parse(p.status) : p.status,
                            location: typeof p.location === "string" ? JSON.parse(p.location) : p.location,
                            features: Array.isArray(p.features)
                                ? {
                                    en: p.features.map((f: string) => {
                                        try {
                                            return JSON.parse(f).en;
                                        } catch {
                                            return f; // fallback if not JSON
                                        }
                                    }),
                                    ar: p.features.map((f: string) => {
                                        try {
                                            return JSON.parse(f).ar;
                                        } catch {
                                            return f;
                                        }
                                    }),
                                }
                                : { en: [], ar: [] },
                        };


                        return (
                            <motion.div
                                key={parsed._id}
                                variants={fadeInUp}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                <Card {...parsed} />
                            </motion.div>
                        );
                    })
                )}
            </motion.div>

            {/* View all button */}
            <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
            >
                <Button
                    size="lg"
                    onClick={() => router.push(`/Projects/`)}
                    className="text-lg px-8 py-6"
                >
                    <Building2 className="w-5 h-5 mr-2" />
                    View All Projects
                </Button>
            </motion.div>
        </div>
    );
};

export default FeaturedProjects;

"use client";
import { getSingleProject } from "@/server/Projects";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useState, use } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Home,
    ShoppingBag,
    MapPin,
    Clock,
    Award,
    Building2,
    Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Head from "next/head";
import { useLocale } from "next-intl"; // ✅ ensure you're using next-intl

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const { id } = use(params);
    const locale = useLocale();

    // @typescript-eslint/no-explicit-any
    const getLocalizedString = (field: any) => {
        if (!field && field !== 0) return "";
        if (typeof field === "string") return field;
        if (field[locale]) return field[locale];
        if (field.en) return field.en;
        try {
            return String(field);
        } catch {
            return "";
        }
    };
    //@typescript-eslint/no-explicit-any
    const formatStatus = (statusField: any) => {
        const raw = (getLocalizedString(statusField) || "").toLowerCase();

        if (!raw) return "";
        if (raw.includes("complete"))
            return locale === "en" ? "Completed" : "مكتمل";
        if (
            raw.includes("in-progress") ||
            raw.includes("in progress") ||
            raw.includes("progress")
        ) {
            return locale === "en" ? "In Progress" : "تحت الانشاء";
        }
        if (raw.includes("plan") || raw.includes("planning"))
            return locale === "en" ? "Planning" : "مخطط";

        return getLocalizedString(statusField);
    };

    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const { data: project, isLoading, isError } = useQuery({
        queryKey: ["project", id],
        queryFn: () => getSingleProject(id as string),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Spinner className="text-blue-500" size={64} />
            </div>
        );
    }

    if (isError || !project) {
        return <div className="text-center p-10">Project not found</div>;
    }

    const nextImage = () => {
        if (!Array.isArray(project?.image)) return;
        setCurrentImageIndex((prev) => (prev + 1) % project.image.length);
    };

    const prevImage = () => {
        if (!Array.isArray(project?.image)) return;
        setCurrentImageIndex(
            (prev) => (prev - 1 + project.image.length) % project.image.length
        );
    };

    return (
        <>
            <Head>
                <title>El Qasr Development | Project</title>
                <meta
                    name="description"
                    content="El Qasr Development provides premium residential and commercial projects in Egypt."
                />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content="El Qasr Development" />
                <meta
                    property="og:description"
                    content="Premium residential and commercial projects in Egypt."
                />
                <meta
                    property="og:image"
                    content="https://realestate-gallery.s3.eu-central-1.amazonaws.com/projects/elqasr-logo.png"
                />
                <meta property="og:url" content="https://elqasr-development.com" />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>

            <div className="min-h-screen bg-white">
                {/* Hero / Banner */}
                <section className="relative">
                    <div className="relative h-96 md:h-[500px] overflow-hidden">
                        {Array.isArray(project?.image) && project.image.length > 0 && (
                            <motion.div
                                key={currentImageIndex}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6 }}
                                className="relative w-full h-full"
                            >
                                <Image
                                    src={project.image[currentImageIndex]}
                                    alt="project image"
                                    fill
                                    className="object-cover cursor-zoom-in"
                                    onClick={() => {
                                        setIndex(currentImageIndex);
                                        setOpen(true);
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/30 pointer-events-none" />
                            </motion.div>
                        )}

                        {/* ✅ Lightbox */}
                        <Lightbox
                            open={open}
                            close={() => setOpen(false)}
                            index={index}
                            slides={(project?.image || []).map((src: string) => ({ src }))}
                            plugins={[Zoom, Fullscreen]}
                        />

                        {/* Prev/Next buttons */}
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>

                        {/* Gallery indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                            {Array.isArray(project?.image) &&
                                project?.image.map((_: never, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`w-3 h-3 rounded-full transition-colors ${
                                            idx === currentImageIndex ? "bg-white" : "bg-white/50"
                                        }`}
                                    />
                                ))}
                        </div>

                        {/* Project summary card */}
                        <motion.div
                            className="absolute bottom-8 left-8 right-8 md:left-16 md:right-auto md:max-w-lg"
                            initial={{ opacity: 0, x: -60 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                        >
                            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <Badge variant="default">{formatStatus(project.status)}</Badge>
                                    <Badge variant="outline">
                                        {project?.type === "residential" ? (
                                            <>
                                                <Home className="w-3 h-3 mr-1" />
                                                {locale==="en"?"Residential":"سكني"}
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingBag className="w-3 h-3 mr-1" />
                                                {locale==="en"?"Commercial":"تجاري"}
                                            </>
                                        )}
                                    </Badge>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    {getLocalizedString(project.title)}
                                </h1>
                                <div className="flex items-center text-gray-600 mb-2">
                                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                                    {getLocalizedString(project.location)}
                                </div>
                                {project?.completionDate && (
                                    <div className="flex items-center text-gray-600">
                                        <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
                                        {locale === "en" ? "Completed:" : "تاريخ الانتهاء:"}{" "}
                                        {new Date(project?.completionDate).toLocaleDateString(locale)}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Overview */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            <motion.div
                                className="lg:col-span-2"
                                initial={{ opacity: 0, x: -60 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, ease: "easeOut" }}
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 60 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    viewport={{ once: true }}
                                >
                                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                        {locale === "en" ? "Project Overview" : "نظرة عامة على المشروع"}
                                    </h2>
                                    <div className="prose prose-lg max-w-none">
                                        <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-wrap break-words">
                                            {getLocalizedString(project.description)}
                                        </p>
                                    </div>
                                </motion.div>

                                <Separator className="my-8" />

                                {project?.features?.[locale] && project.features[locale].length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 60 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                        viewport={{ once: true }}
                                    >
                                        <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                            {locale === "en" ? "Key Features" : "الميزات الرئيسية"}
                                        </h3>

                                        <motion.div className="grid md:grid-cols-2 gap-4">
                                            {project.features[locale].map((f: string, i: number) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    whileInView={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                                    viewport={{ once: true }}
                                                    className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg"
                                                >
                                                    <Award className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                                    <span className="text-gray-700">{f}</span>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    </motion.div>
                                )}

                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                {locale === "en"
                                    ? "Explore More Projects"
                                    : "استكشف المزيد من المشاريع"}
                            </h2>
                            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                                {locale === "en"
                                    ? "Discover our portfolio of exceptional construction projects across residential and commercial sectors."
                                    : "اكتشف مجموعتنا من المشاريع السكنية والتجارية المميزة."}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    size="lg"
                                    onClick={() => router.push(`/Projects/`)}
                                    className="text-lg px-8 py-6"
                                >
                                    <Building2 className="w-5 h-5 mr-2" />
                                    {locale === "en" ? "View All Projects" : "عرض كل المشاريع"}
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => router.push(`/About/`)}
                                    className="text-lg px-8 py-6"
                                >
                                    <Users className="w-5 h-5 mr-2" />
                                    {locale === "en" ? "About Our Team" : "عن فريقنا"}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
}

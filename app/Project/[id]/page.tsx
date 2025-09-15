"use client"
import { getSingleProject} from "@/server/Projects";
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {Spinner} from "@/components/ui/shadcn-io/spinner";
import {Separator} from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import Image from "next/image";
import {useState,use} from "react";
import {ChevronLeft,ChevronRight,Home,ShoppingBag,MapPin,Clock,Award,Building2,Users }from 'lucide-react';
import { useRouter } from 'next/navigation';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Head from "next/head";


export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const { id } = use(params);
    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    const slideInLeft = {
        initial: { opacity: 0, x: -60 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.7, ease: "easeOut" }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const scaleIn = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5, ease: "easeOut" }
    };
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const { data: project, isLoading, isError } = useQuery({
        queryKey: ['project', id],
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
        setCurrentImageIndex((prev) => (prev - 1 + project.image.length) % project.image.length);
    };

    return(
        <>
            <Head>
                <title>El Qasr Development | Project</title>
                <meta
                    name="description"
                    content="El Qasr Development provides premium residential and commercial projects in Egypt."
                />
                <meta name="robots" content="index, follow" />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content="El Qasr Development" />
                <meta property="og:description" content="Premium residential and commercial projects in Egypt." />
                <meta property="og:image" content="https://realestate-gallery.s3.eu-central-1.amazonaws.com/projects/1757505764687-%C3%98%C2%A7%C3%99%C2%84%C3%99%C2%82%C3%98%C2%B5%C3%98%C2%B1+copy.png" />
                <meta property="og:url" content="https://elqasr-development.com" />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <div className="min-h-screen bg-white">
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
                                            console.log("Image clicked!");
                                            setIndex(currentImageIndex);
                                            setOpen(true);
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/30 pointer-events-none"  />
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

                            {/* Gallery Indicators */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                                {Array.isArray(project?.image) && project?.image.map((_:never, index:number) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`w-3 h-3 rounded-full transition-colors ${
                                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                        }`}
                                    />
                                ))}
                            </div>

                            <motion.div
                                className="absolute bottom-8 left-8 right-8 md:left-16 md:right-auto md:max-w-lg "
                                initial="initial"
                                animate="animate"
                                variants={slideInLeft}
                            >
                                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Badge
                                            variant='default'
                                        >
                                            {project?.status === "completed"
                                                ? "Completed"
                                                : project?.status === "in-progress"
                                                    ? "In Progress"
                                                    : "Planning"}
                                        </Badge>
                                        <Badge variant="outline">
                                            {project?.type === "residential" ? (
                                                <>
                                                    <Home className="w-3 h-3 mr-1" />
                                                    Residential
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingBag className="w-3 h-3 mr-1" />
                                                    Commercial
                                                </>
                                            )}
                                        </Badge>
                                    </div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{project?.title}</h1>
                                    <div className="flex items-center text-gray-600 mb-2">
                                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                                        {project?.location}
                                    </div>
                                    {project?.completionDate && (
                                        <div className="flex items-center text-gray-600">
                                            <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
                                            Completed: {project?.completionDate}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </section>
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Main Content */}
                            <motion.div
                                className="lg:col-span-2"
                                initial="initial"
                                whileInView="animate"
                                viewport={{ once: true }}
                                variants={slideInLeft}
                            >
                                <motion.div variants={fadeInUp}>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Project Overview</h2>
                                    <div className="prose prose-lg max-w-none">
                                        <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-wrap break-words">
                                            {project.description}
                                        </p>
                                        <p className="text-gray-600 leading-relaxed mb-6">
                                            This project represents our commitment to excellence in {project.type === 'mall' ? 'commercial' : 'residential'} construction.
                                            Our team worked closely with architects, engineers, and stakeholders to deliver a structure that not only meets
                                            functional requirements but also sets new standards for design and sustainability in the region.
                                        </p>
                                        <p className="text-gray-600 leading-relaxed">
                                            From the initial planning phases through to completion, every aspect of this project was executed with meticulous
                                            attention to detail, ensuring the highest quality standards and client satisfaction.
                                        </p>
                                    </div>
                                </motion.div>

                                <Separator className="my-8" />

                                {project?.features.length > 0 && <motion.div variants={fadeInUp}>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h3>
                                    <motion.div
                                        className="grid md:grid-cols-2 gap-4"
                                        variants={staggerContainer}
                                    >
                                        {project?.features.map((feature:string) => (
                                            <motion.div
                                                key={feature}
                                                variants={scaleIn}
                                                className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg"
                                            >
                                                <Award className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                                <span className="text-gray-700">{feature}</span>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </motion.div>}
                            </motion.div>
                        </div>
                    </div>
                </section>
                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore More Projects</h2>
                            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                                Discover our portfolio of exceptional construction projects across residential and commercial sectors.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    size="lg"
                                    onClick={() => router.push(`/Projects/`)}
                                    className="text-lg px-8 py-6"
                                >
                                    <Building2 className="w-5 h-5 mr-2" />
                                    View All Projects
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => router.push(`/About/`)}
                                    className="text-lg px-8 py-6"
                                >
                                    <Users className="w-5 h-5 mr-2" />
                                    About Our Team
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    )
}


"use client";
import { useQuery } from "@tanstack/react-query";
import * as motion from "motion/react-client";
import Card from "@components/ProjectCard/ProjectCard";
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { getAllProjects } from "@/server/Projects";
import React from "react";
import {Button} from "@/components/ui/button";
import {Building2} from "lucide-react";
import { useRouter } from 'next/navigation';

interface Project {
    _id: string;
    title: string;
    type: "Residential" | "Commercial";
    description: string;
    image: [string];
    status: "completed" | "in-progress" | "Planning";
    location: string;
    completionDate?: string;
}

const FeaturedProjects = () => {
    const router = useRouter();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["project"],
        queryFn:  () => getAllProjects({ page: 1, limit: 3 }),
    });
    const typedData = data as { data: Project[] };


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
            <motion.div
                className="text-center mb-16"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
            >
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Featured Projects</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Explore our portfolio of exceptional construction projects, from luxury residential developments to commercial complexes.
                </p>
            </motion.div>
            <motion.div
                className="grid lg:grid-cols-3 gap-8"
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
                    typedData.data?.map((project: Project, index: number) => (
                        <motion.div
                            key={project._id}
                            variants={fadeInUp}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                        >
                            <Card
                                _id={project._id}
                                title={project.title}
                                description={project.description}
                                image={project.image}
                                type={project.type}
                                location={project.location}
                                status={project.status}
                                completionDate={project.completionDate}
                            />
                        </motion.div>
                    ))
                )}
            </motion.div>
            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={staggerContainer}>
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
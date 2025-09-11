"use client";
import { useQuery } from "@tanstack/react-query";
import * as motion from "motion/react-client";
import Card from "@components/ProjectCard/ProjectCard";
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { getAllProjects } from "@/server/Projects";
import React from "react";

interface Project {
    id: number;
    title: string;
    type: "home" | "mall";
    description: string;
    image: [string];
    status: "completed" | "in-progress" | "planning";
    location: string;
    completionDate?: string;
}

const FeaturedProjects = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["project"],
        queryFn: getAllProjects,
    });

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
                    data?.map((project: Project, index: number) => (
                        <motion.div
                            key={project.id}
                            variants={fadeInUp}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                        >
                            <Card
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
        </div>
    );
};

export default FeaturedProjects;
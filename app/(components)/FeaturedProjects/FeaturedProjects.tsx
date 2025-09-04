"use client"
import {useState} from "react";
import * as motion from "motion/react-client";
// @ts-ignore
import Card from "@components/ProjectCard/ProjectCard"

interface Project {
    id: number;
    title: string;
    type: 'home' | 'mall';
    description: string;
    image: string;
    status: 'completed' | 'in-progress' | 'planning';
    location: string;
    completionDate?: string;
}
const FeaturedProjects = () => {
    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };
    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [projects, setProjects] = useState<Project[]>([
        {
            id: 1,
            title: "Luxury Residential Complex",
            type: "home",
            description: "A modern 50-unit residential complex featuring sustainable design and premium amenities.",
            image: "https://images.unsplash.com/photo-1721815693498-cc28507c0ba2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob21lJTIwY29uc3RydWN0aW9ufGVufDF8fHx8MTc1NjM4MDIzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
            status: "completed",
            location: "Beverly Hills, CA",
            completionDate: "December 2024"
        },
        {
            id: 2,
            title: "Metropolitan Shopping Center",
            type: "mall",
            description: "A state-of-the-art shopping center with 200+ retail spaces and entertainment facilities.",
            image: "https://images.unsplash.com/photo-1565621758117-7d6d460476f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMG1hbGwlMjBjb25zdHJ1Y3Rpb258ZW58MXx8fHwxNzU2MzgwMjM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
            status: "in-progress",
            location: "Downtown LA, CA",
            completionDate: "June 2025"
        },
        {
            id: 3,
            title: "Executive Office Complex",
            type: "home",
            description: "Premium office spaces with modern architecture and smart building technology.",
            image: "https://images.unsplash.com/photo-1710706488826-6d527c0e95ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMG1hbGwlMjBjb25zdHJ1Y3Rpb258ZW58MXx8fHwxNzU2MzgwMjM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
            status: "planning",
            location: "Santa Monica, CA"
        }
    ]);
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
                {projects.map((project:Project,index:number) => (
                    <motion.div
                        key={project.id}
                        variants={fadeInUp}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                    >
                        <Card title={project.title} description={project.description} image={project.image} type={project.type} location={project.location} status={project.status} completionDate={project.completionDate} />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}
export default FeaturedProjects

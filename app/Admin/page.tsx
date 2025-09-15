"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    useQuery,
    useMutation,
    useQueryClient,
    keepPreviousData,
} from "@tanstack/react-query";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { getAllProjects, CreateProject } from "@/server/Projects";
import { FilterButton } from "@components/FilterButton/FilterButton";
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ProjectCard from "@components/ProjectCard/ProjectCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from '@/components/ui/alert';
import Head from "next/head";

interface Project {
    _id: string;
    title: string;
    type: "Residential" | "Commercial";
    description: string;
    image: string[];
    status: "completed" | "in-progress" | "Planning";
    location: string;
    completionDate?: string;
    features: string[];
}

type ProjectType = "Residential" | "Commercial";
type ProjectStatus = "completed" | "in-progress" | "Planning";

export default function AdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const queryClient = useQueryClient();

    // ✅ Protect route
    useEffect(() => {
        if (status !== "loading" && (!session || session.user.role !== "admin")) {
            router.replace("/");
        }
    }, [session, status, router]);

    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        type: "Residential" as ProjectType,
        status: "completed" as ProjectStatus,
        completionDate: "",
        features: [] as string[],
        featureInput: "",
        images: [] as File[],
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [title, setTitle] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [description, setDescription] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [location, setLocation] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [type, setType] = useState<ProjectType>("Residential");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [statusProject, setStatusProject] = useState<ProjectStatus>("completed");
    const [completionDate, setCompletionDate] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [imageInput, setImageInput] = useState<File[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [features, setFeatures] = useState<string[]>([]);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<{ status?: string; type?: string }>({});

    // ✅ Queries
    const { data, isLoading, isError } = useQuery({
        queryKey: ["projects", page, filters],
        queryFn: () => getAllProjects({ page, limit:9, ...filters }),
        placeholderData: keepPreviousData,
    });

    const mutation = useMutation({
        mutationFn: (formData: FormData) => CreateProject(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            resetForm();
        },
    });

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setType("Residential");
        setStatusProject("completed");
        setCompletionDate("");
        setImageInput([]);
        setFeatures([]);
        setLocation("");
    };

    // ✅ Handlers
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted");

        const submissionData = new FormData();
        submissionData.append("title", formData.title);
        submissionData.append("description", formData.description);
        submissionData.append("type", formData.type);
        submissionData.append("status", formData.status);
        submissionData.append("location", formData.location);
        if (completionDate) {
            const dateValue = new Date(completionDate);
            if (!isNaN(dateValue.getTime())) {
                submissionData.append("completionDate", dateValue.toISOString());
            }
        }        formData.features.forEach((feat) => submissionData.append("features[]", feat));
        formData.images.forEach((file) => submissionData.append("image", file));

        mutation.mutate(submissionData);
        setIsAddDialogOpen(false);
        showNotification('Project added successfully!', 'success');
    };

    const handleFilter = (key: "status" | "type", value?: string) => {
        setPage(1);
        setFilters({ [key]: value });
    };

    if (status === "loading") return (<div className=" flex items-center justify-center"><Spinner className="text-blue-500" size={64} />
    </div>
        );
    if (!session || session.user.role !== "admin") return null;

    return (
        <>
            <Head>
                <title>El Qasr Development | Admin</title>
                <meta
                    name="description"
                    content="El Qasr Development provides premium residential and commercial projects in Egypt."
                />
                <meta name="robots" content="index, follow" />
            </Head>
            <div className="min-h-screen bg-white">
                {/* Top Section with Add Button */}
                <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 flex items-center justify-center gap-4">
                    <div className="max-w-7xl mx-auto px-4">
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Project
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Add New Project</DialogTitle>
                                    <DialogDescription>
                                        Fill in the details for the new construction project.
                                    </DialogDescription>
                                </DialogHeader>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="title">Project Title *</Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) =>
                                                setFormData({ ...formData, title: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="type">Project Type</Label>
                                        <Select
                                            value={formData.type}
                                            onValueChange={(value: ProjectType) =>
                                                setFormData({ ...formData, type: value })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Residential">Residential</SelectItem>
                                                <SelectItem value="Commercial">Commercial</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            value={formData.location}
                                            onChange={(e) =>
                                                setFormData({ ...formData, location: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="status">Status</Label>
                                        <Select
                                            value={formData.status}
                                            onValueChange={(value: ProjectStatus) =>
                                                setFormData({ ...formData, status: value })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Planning">Planning</SelectItem>
                                                <SelectItem value="in-progress">In Progress</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            rows={3}
                                            className="w-full resize-y whitespace-pre-wrap break-words break-all overflow-x-hidden"
                                            value={formData.description}
                                            onChange={(e) =>
                                                setFormData({ ...formData, description: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="images">Upload Images</Label>
                                        <Input
                                            id="images"
                                            type="file"
                                            multiple
                                            onChange={(e) => {
                                                if (e.target.files) {
                                                    setFormData({
                                                        ...formData,
                                                        images: Array.from(e.target.files),
                                                    });
                                                }
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="completionDate">Completion Date</Label>
                                        <Input
                                            id="completionDate"
                                            type="date"
                                            value={formData.completionDate}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    completionDate: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div>
                                        <Label>Features</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={formData.featureInput}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, featureInput: e.target.value })
                                                }
                                            />
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    if (formData.featureInput.trim()) {
                                                        setFormData({
                                                            ...formData,
                                                            features: [
                                                                ...formData.features,
                                                                formData.featureInput.trim(),
                                                            ],
                                                            featureInput: "",
                                                        });
                                                    }
                                                }}
                                            >
                                                Add
                                            </Button>
                                        </div>

                                        <div className="flex gap-2 mt-2 flex-wrap">
                                            {formData.features.map((feat, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1 bg-gray-200 rounded-full flex items-center gap-2"
                                                >
                            {feat}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setFormData({
                                                                ...formData,
                                                                features: formData.features.filter(
                                                                    (_, idx) => idx !== i
                                                                ),
                                                            })
                                                        }
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                              ✕
                            </button>
                          </span>
                                            ))}
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            type="button"
                                            onClick={() => setIsAddDialogOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={mutation.status === "pending"}>
                                            {mutation.status === "pending" ? "Adding..." : "Add Project"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </section>
                {notification && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                        <Alert className={notification.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                            <AlertDescription className={notification.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                                {notification.message}
                            </AlertDescription>
                        </Alert>
                    </div>
                )}
                {/* Projects List */}
                <section className="py-8 bg-white">
                    <div className="max-w-7xl mx-auto px-4">
                        {/* Filters */}
                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            <FilterButton onClick={() => setFilters({})} active={!Object.keys(filters).length}>
                                All
                            </FilterButton>
                            <FilterButton onClick={() => handleFilter("type", "Residential")} active={filters.type === "Residential"}>
                                Residential
                            </FilterButton>
                            <FilterButton onClick={() => handleFilter("type", "Commercial")} active={filters.type === "Commercial"}>
                                Commercial
                            </FilterButton>
                            <FilterButton onClick={() => handleFilter("status", "completed")} active={filters.status === "completed"}>
                                Completed
                            </FilterButton>
                            <FilterButton onClick={() => handleFilter("status", "in-progress")} active={filters.status === "in-progress"}>
                                In Progress
                            </FilterButton>
                            <FilterButton onClick={() => handleFilter("status", "Planning")} active={filters.status === "Planning"}>
                                Planning
                            </FilterButton>
                        </div>

                        {/* Content */}
                        {isLoading ? (
                            <div className="flex justify-center items-center min-h-[200px]">
                                <Spinner size="sm" />
                            </div>
                        ) : isError ? (
                            <div className="text-center text-red-500">Failed to load projects.</div>
                        ) : (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={JSON.stringify(data?.data)}
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
                                            <ProjectCard {...project} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        )}

                        {/* Pagination */}
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
                                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            >
                                ← Previous
                            </Button>

                            <span className="text-sm font-medium px-3 py-1 bg-gray-100 rounded-full">
                  Page {data?.currentPage} of {data?.totalPages}
                </span>

                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === data?.totalPages}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                Next →
                            </Button>
                        </motion.div>
                    </div>
                </section>

            </div>
        </>
    );
}

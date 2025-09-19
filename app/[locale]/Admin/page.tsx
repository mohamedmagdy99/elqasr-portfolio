'use client';

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    useQuery,
    useMutation,
    useQueryClient,
    keepPreviousData,
} from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";
import { useTranslations, useLocale } from "next-intl";

import { getAllProjects, CreateProject } from "@/server/Projects";
import { FilterButton } from "@components/FilterButton/FilterButton";
import {ProjectCard} from "@components/ProjectCard/ProjectCard";

import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type LocaleKey = "en" | "ar";
type LocalizedString = { en: string; ar: string };
type LocalizedStringArray = { en: string[]; ar: string[] };

type ProjectType = "Residential" | "Commercial";
type ProjectStatus = "completed" | "in-progress" | "Planning";

interface Project {
    _id: string;
    title: LocalizedString;
    description: LocalizedString;
    location: LocalizedString;
    status: LocalizedString;
    type: ProjectType;
    completionDate?: string;
    image: string[];
    features?: LocalizedStringArray;
}

const AdminPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const queryClient = useQueryClient();
    const t = useTranslations("AdminPage");
    const locale = useLocale() as LocaleKey;
    const isRtl = locale === "ar";

    // ✅ Protect route
    useEffect(() => {
        if (status !== "loading" && (!session || session.user.role !== "admin")) {
            router.replace("/");
        }
    }, [session, status, router]);

    // ✅ Notifications
    const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const showNotification = (message: string, type: "success" | "error") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // ✅ Form state
    const [formData, setFormData] = useState({
        title: { en: "", ar: "" },
        description: { en: "", ar: "" },
        location: { en: "", ar: "" },
        type: "Residential" as ProjectType,
        status: "completed" as ProjectStatus,
        completionDate: "",
        features: { en: [] as string[], ar: [] as string[] },
        featureInput: { en: "", ar: "" },
        images: [] as File[],
    });

    const resetForm = () =>
        setFormData({
            title: { en: "", ar: "" },
            description: { en: "", ar: "" },
            location: { en: "", ar: "" },
            type: "Residential",
            status: "completed",
            completionDate: "",
            features: { en: [], ar: [] },
            featureInput: { en: "", ar: "" },
            images: [],
        });

    // ✅ UI state
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<{ status?: string; type?: string }>({});

    // ✅ Data fetching
    const { data, isLoading, isError } = useQuery({
        queryKey: ["projects", page, filters],
        queryFn: () => getAllProjects({ page, limit: 9, ...filters }),
        placeholderData: keepPreviousData,
    });

    // ✅ Mutations
    const mutation = useMutation({
        mutationFn: (payload: { formData: FormData }) => CreateProject(payload.formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            showNotification(t("add_success_message"), "success");
            setIsAddDialogOpen(false);
            resetForm();
        },
        onError: () => showNotification(t("add_error_message"), "error"),
    });

    // ✅ Handlers
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.en.trim() || !formData.title.ar.trim()) {
            showNotification(t("validation_error_message"), "error");
            return;
        }

        const submissionData = new FormData();
        submissionData.append("title[en]", formData.title.en);
        submissionData.append("title[ar]", formData.title.ar);
        submissionData.append("description[en]", formData.description.en);
        submissionData.append("description[ar]", formData.description.ar);
        submissionData.append("location[en]", formData.location.en);
        submissionData.append("location[ar]", formData.location.ar);
        submissionData.append("status[en]", formData.status);
        submissionData.append("status[ar]", formData.status); // adjust if you want separate translations
        submissionData.append("type", formData.type);

        if (formData.completionDate) {
            submissionData.append("completionDate", new Date(formData.completionDate).toISOString());
        }

        formData.features.en.forEach((feat, i) => submissionData.append(`features[en][${i}]`, feat));
        formData.features.ar.forEach((feat, i) => submissionData.append(`features[ar][${i}]`, feat));
        formData.images.forEach((file) => submissionData.append("image", file));

        mutation.mutate({ formData: submissionData });
    };

    const handleFilter = (key: "status" | "type", value?: string) => {
        setPage(1);
        setFilters(value ? { [key]: value } : {});
    };

    // ✅ Status & type options
    const projectStatuses: ProjectStatus[] = ["Planning", "in-progress", "completed"];
    const projectTypes: ProjectType[] = ["Residential", "Commercial"];

    // ✅ Access checks
    if (status === "loading")
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner className="text-blue-500" size={64} />
            </div>
        );
    if (!session || session.user.role !== "admin") return null;

    return (
        <>
            <Head>
                <title>{t("page_title")}</title>
                <meta name="description" content={t("meta_description")} />
                <meta name="robots" content="index, follow" />
            </Head>

            <div className="min-h-screen bg-white" dir={isRtl ? "rtl" : "ltr"}>
                {/* Add Project Section */}
                <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 flex items-center justify-center gap-4">
                    <div className="max-w-7xl mx-auto px-4">
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className={`w-4 h-4 ${isRtl ? "ml-2" : "mr-2"}`} />
                                    {t("add_project_button")}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>{t("add_project_title")}</DialogTitle>
                                    <DialogDescription>{t("add_project_description")}</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Tabs for languages */}
                                    <Tabs defaultValue="en" className="w-full">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="en">English</TabsTrigger>
                                            <TabsTrigger value="ar">Arabic</TabsTrigger>
                                        </TabsList>

                                        {(["en", "ar"] as LocaleKey[]).map((lng) => (
                                            <TabsContent key={lng} value={lng}>
                                                <div dir={lng === "ar" ? "rtl" : "ltr"} className="space-y-4">
                                                    <div>
                                                        <Label>{t("title_label")} *</Label>
                                                        <Input
                                                            value={formData.title[lng]}
                                                            onChange={(e) => setFormData({ ...formData, title: { ...formData.title, [lng]: e.target.value } })}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>{t("location_label")}</Label>
                                                        <Input
                                                            value={formData.location[lng]}
                                                            onChange={(e) => setFormData({ ...formData, location: { ...formData.location, [lng]: e.target.value } })}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>{t("description_label")}</Label>
                                                        <Textarea
                                                            rows={3}
                                                            value={formData.description[lng]}
                                                            onChange={(e) => setFormData({ ...formData, description: { ...formData.description, [lng]: e.target.value } })}
                                                        />
                                                    </div>
                                                    {/* Features */}
                                                    <div>
                                                        <Label>{t("features_label")}</Label>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                value={formData.featureInput[lng]}
                                                                onChange={(e) =>
                                                                    setFormData({ ...formData, featureInput: { ...formData.featureInput, [lng]: e.target.value } })
                                                                }
                                                            />
                                                            <Button
                                                                type="button"
                                                                onClick={() => {
                                                                    const val = formData.featureInput[lng].trim();
                                                                    if (val) {
                                                                        setFormData({
                                                                            ...formData,
                                                                            features: { ...formData.features, [lng]: [...formData.features[lng], val] },
                                                                            featureInput: { ...formData.featureInput, [lng]: "" },
                                                                        });
                                                                    }
                                                                }}
                                                            >
                                                                {t("add_feature_button")}
                                                            </Button>
                                                        </div>
                                                        <div className="flex gap-2 mt-2 flex-wrap">
                                                            {formData.features[lng].map((feat, i) => (
                                                                <span key={i} className="px-3 py-1 bg-gray-200 rounded-full flex items-center gap-2">
                                  {feat}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setFormData({
                                                                                ...formData,
                                                                                features: {
                                                                                    ...formData.features,
                                                                                    [lng]: formData.features[lng].filter((_, idx) => idx !== i),
                                                                                },
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
                                                </div>
                                            </TabsContent>
                                        ))}
                                    </Tabs>

                                    {/* Type */}
                                    <div>
                                        <Label>{t("type_label")}</Label>
                                        <Select value={formData.type} onValueChange={(val: ProjectType) => setFormData({ ...formData, type: val })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {projectTypes.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {t(`project_types.${type.toLowerCase()}`)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <Label>{t("status_label")}</Label>
                                        <Select value={formData.status} onValueChange={(val: ProjectStatus) => setFormData({ ...formData, status: val })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {projectStatuses.map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {t(`project_statuses.${status.toLowerCase()}`)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Completion Date */}
                                    <div>
                                        <Label>{t("completion_date_label")}</Label>
                                        <Input
                                            type="date"
                                            value={formData.completionDate}
                                            onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                                        />
                                    </div>

                                    {/* Images */}
                                    <div>
                                        <Label>{t("images_label")}</Label>
                                        <Input
                                            type="file"
                                            multiple
                                            onChange={(e) => e.target.files && setFormData({ ...formData, images: Array.from(e.target.files) })}
                                        />
                                    </div>

                                    <DialogFooter>
                                        <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>
                                            {t("cancel_button")}
                                        </Button>
                                        <Button type="submit" disabled={mutation.status === "pending"}>
                                            {mutation.status === "pending" ? t("adding_button") : t("add_project_submit_button")}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </section>

                {/* Notifications */}
                {notification && (
                    <div className="max-w-7xl mx-auto px-4 pt-4">
                        <Alert className={notification.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                            <AlertDescription className={notification.type === "success" ? "text-green-800" : "text-red-800"}>
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
                            <FilterButton onClick={() => handleFilter("type")} active={!Object.keys(filters).length}>
                                {t("all_filter")}
                            </FilterButton>
                            {projectTypes.map((type) => (
                                <FilterButton key={type} onClick={() => handleFilter("type", type)} active={filters.type === type}>
                                    {t(`${type.toLowerCase()}_filter`)}
                                </FilterButton>
                            ))}
                            {projectStatuses.map((s) => (
                                <FilterButton key={s} onClick={() => handleFilter("status", s)} active={filters.status === s}>
                                    {t(`${s.toLowerCase()}_filter`)}
                                </FilterButton>
                            ))}
                        </div>

                        {/* Projects */}
                        {isLoading ? (
                            <div className="flex justify-center items-center min-h-[200px]">
                                <Spinner size="sm" />
                            </div>
                        ) : isError ? (
                            <div className="text-center text-red-500">{t("load_error")}</div>
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
                            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(p - 1, 1))}>
                                {t("previous_button")}
                            </Button>
                            <span className="text-sm font-medium px-3 py-1 bg-gray-100 rounded-full">
                {t("page_indicator", { currentPage: data?.currentPage, totalPages: data?.totalPages })}
              </span>
                            <Button variant="outline" size="sm" disabled={page === data?.totalPages} onClick={() => setPage((p) => p + 1)}>
                                {t("next_button")}
                            </Button>
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default AdminPage;

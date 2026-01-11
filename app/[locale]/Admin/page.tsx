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
import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";
import { useTranslations, useLocale } from "next-intl";

import { getAllMainProjects, createMainProject } from "@/server/mainProjects";
import { FilterButton } from "@components/FilterButton/FilterButton";
import { MainProjectCard } from "@components/MainProjectCard/MainProjectCard";

import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { Plus, History } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type LocaleKey = "en" | "ar";
type ProjectType = "Residential" | "Commercial";
type ProjectState = "available" | "sold";

const AdminPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("AdminPage");
  const locale = useLocale() as LocaleKey;
  const isRtl = locale === "ar";

  // ✅ Route Protection
  useEffect(() => {
    if (status !== "loading" && (!session || session.user.role !== "admin")) {
      router.replace("/");
    }
  }, [session, status, router]);

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ✅ State Management
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<{ state?: string; type?: string }>({});

  const [formData, setFormData] = useState({
    title: { en: "", ar: "" },
    description: { en: "", ar: "" },
    location: { en: "", ar: "" },
    type: "Residential" as ProjectType,
    state: "available" as ProjectState,
    images: [] as File[],
  });

  const resetForm = () =>
    setFormData({
      title: { en: "", ar: "" },
      description: { en: "", ar: "" },
      location: { en: "", ar: "" },
      type: "Residential",
      state: "available",
      images: [],
    });

  // ✅ Data Fetching
  const { data, isLoading, isError } = useQuery({
    queryKey: ["projects", page, filters],
    queryFn: () => getAllMainProjects({ page, limit: 9, ...filters }),
    placeholderData: keepPreviousData,
  });

  // ✅ Mutations
  const mutation = useMutation({
    mutationFn: (payload: FormData) => createMainProject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      showNotification(t("add_success_message"), "success");
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error: any) =>
      showNotification(error.message || t("add_error_message"), "error"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title.en ||
      !formData.title.ar ||
      formData.images.length === 0
    ) {
      showNotification(t("validation_error_message"), "error");
      return;
    }

    const submissionData = new FormData();
    // Match backend expected keys: title[en], title[ar], etc.
    submissionData.append("title[en]", formData.title.en);
    submissionData.append("title[ar]", formData.title.ar);
    submissionData.append("description[en]", formData.description.en);
    submissionData.append("description[ar]", formData.description.ar);
    submissionData.append("location[en]", formData.location.en);
    submissionData.append("location[ar]", formData.location.ar);
    submissionData.append("type", formData.type);
    submissionData.append("state", formData.state);

    formData.images.forEach((file) => {
      submissionData.append("image", file);
    });

    mutation.mutate(submissionData);
  };

  const handleFilter = (key: "state" | "type", value?: string) => {
    setPage(1);
    setFilters((prev) =>
      value ? { ...prev, [key]: value } : { ...prev, [key]: undefined }
    );
  };

  if (status === "loading")
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="text-blue-500" size={64} />
      </div>
    );

  if (!session || session.user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]" dir={isRtl ? "rtl" : "ltr"}>
      <Head>
        <title>Admin | {t("page_title")}</title>
      </Head>

      {/* --- HEADER SECTION --- */}
      <div className="bg-white border-b border-gray-100 py-12 pt-32">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center gap-6">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <History size={24} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              {isRtl ? "إدارة المشاريع" : "Project Management"}
            </h1>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="rounded-full px-8 shadow-lg shadow-blue-100"
              >
                <Plus className={`w-5 h-5 ${isRtl ? "ml-2" : "mr-2"}`} />
                {t("add_project_button")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t("add_project_title")}</DialogTitle>
                <DialogDescription>
                  {t("add_project_description")}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs defaultValue="en" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="ar">العربية</TabsTrigger>
                  </TabsList>

                  {(["en", "ar"] as const).map((lng) => (
                    <TabsContent
                      key={lng}
                      value={lng}
                      className="space-y-4 pt-4"
                    >
                      <div className="space-y-2">
                        <Label>
                          {t("title_label")} ({lng})
                        </Label>
                        <Input
                          value={formData.title[lng]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              title: {
                                ...formData.title,
                                [lng]: e.target.value,
                              },
                            })
                          }
                          placeholder={
                            lng === "ar" ? "اسم المشروع" : "Project Name"
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>
                          {t("location_label")} ({lng})
                        </Label>
                        <Input
                          value={formData.location[lng]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: {
                                ...formData.location,
                                [lng]: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>
                          {t("description_label")} ({lng})
                        </Label>
                        <Textarea
                          rows={4}
                          value={formData.description[lng]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: {
                                ...formData.description,
                                [lng]: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("type_label")}</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(v: ProjectType) =>
                        setFormData({ ...formData, type: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Residential">
                          {isRtl ? "سكني" : "Residential"}
                        </SelectItem>
                        <SelectItem value="Commercial">
                          {isRtl ? "تجاري" : "Commercial"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("status_label")}</Label>
                    <Select
                      value={formData.state}
                      onValueChange={(v: ProjectState) =>
                        setFormData({ ...formData, state: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">
                          {isRtl ? "متاح" : "Available"}
                        </SelectItem>
                        <SelectItem value="sold">
                          {isRtl ? "تم البيع" : "Sold"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t("images_label")}</Label>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files &&
                      setFormData({
                        ...formData,
                        images: Array.from(e.target.files),
                      })
                    }
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full"
                  >
                    {mutation.isPending ? (
                      <Spinner size="sm" />
                    ) : (
                      t("add_project_submit_button")
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {notification && (
          <Alert
            className={`mb-8 ${
              notification.type === "success"
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <AlertDescription
              className={
                notification.type === "success"
                  ? "text-green-800"
                  : "text-red-800"
              }
            >
              {notification.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <FilterButton
            onClick={() => setFilters({})}
            active={Object.keys(filters).length === 0}
          >
            {t("all_filter")}
          </FilterButton>
          <FilterButton
            onClick={() => handleFilter("type", "Residential")}
            active={filters.type === "Residential"}
          >
            {isRtl ? "سكني" : "Residential"}
          </FilterButton>
          <FilterButton
            onClick={() => handleFilter("type", "Commercial")}
            active={filters.type === "Commercial"}
          >
            {isRtl ? "تجاري" : "Commercial"}
          </FilterButton>
          <FilterButton
            onClick={() => handleFilter("state", "available")}
            active={filters.state === "available"}
          >
            {isRtl ? "متاح" : "Available"}
          </FilterButton>
          <FilterButton
            onClick={() => handleFilter("state", "sold")}
            active={filters.state === "sold"}
          >
            {isRtl ? "تم البيع" : "Sold"}
          </FilterButton>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {data?.data?.map((project: any) => (
                <MainProjectCard key={project._id} {...project} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {data?.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-16">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              {t("previous_button")}
            </Button>
            <span className="font-bold text-blue-600">
              {page} / {data.totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page === data.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              {t("next_button")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;

"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  getSingleMainProject,
  getAllProjectsForMain,
} from "@/server/mainProjects";
import { ProjectCard } from "@/app/(components)/ProjectCard/ProjectCard";
import * as motion from "motion/react-client";
import Image from "next/image";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateProject } from "@/server/Projects";
import { useState } from "react";
interface SmallProject {
  _id: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  location: { en: string; ar: string };
  status: { en: string; ar: string };
  type: "Residential" | "Commercial";
  image: string[];
  completionDate?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  features?: { en: string[]; ar: string[] };
}
const STATUS_OPTIONS = {
  Completed: { en: "Completed", ar: "مكتمل" },
  "In Progress": { en: "In Progress", ar: "قيد التنفيذ" },
  Planning: { en: "Planning", ar: "التخطيط" },
  مكتمل: { en: "Completed", ar: "مكتمل" },
  "قيد التنفيذ": { en: "In Progress", ar: "قيد التنفيذ" },
  التخطيط: { en: "Planning", ar: "التخطيط" },
} as const;
export default function MainProjectPage() {
  const params = useParams();
  const id = params.id as string;
  const locale = (params.locale as string) || "en";
  const isRtl = locale === "ar";
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const queryClient = useQueryClient();
  const [featureInputs, setFeatureInputs] = useState({ en: "", ar: "" });
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newUnit, setNewUnit] = useState({
    title: { en: "", ar: "" },
    description: { en: "", ar: "" },
    location: { en: "", ar: "" },
    status: { en: "Available", ar: "متاح" },
    type: "Residential",
    completionDate: "",
    features: { en: [] as string[], ar: [] as string[] },
    images: [] as File[],
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
  });
  const addMutation = useMutation({
    mutationFn: (data: FormData) => CreateProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects-for-main", id] });
      setIsAddOpen(false);
      // Reset form logic here
    },
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    // 1. Link to Main Project automatically from URL ID
    data.append("mainProject", id);

    // 2. Map MultiLang Strings
    data.append("title[en]", newUnit.title.en);
    data.append("title[ar]", newUnit.title.ar);
    data.append("description[en]", newUnit.description.en);
    data.append("description[ar]", newUnit.description.ar);
    data.append("location[en]", newUnit.location.en);
    data.append("location[ar]", newUnit.location.ar);
    data.append("status[en]", newUnit.status.en);
    data.append("status[ar]", newUnit.status.ar);
    data.append("bedrooms", newUnit.bedrooms.toString());
    data.append("bathrooms", newUnit.bathrooms.toString());
    data.append("area", newUnit.area.toString());
    // 3. Map Arrays (Features)
    newUnit.features.en.forEach((f) => data.append("features[en][]", f));
    newUnit.features.ar.forEach((f) => data.append("features[ar][]", f));

    // 4. Common Fields
    data.append("type", newUnit.type);
    if (newUnit.completionDate) {
      data.append("completionDate", newUnit.completionDate);
    }

    // 5. Multiple Images
    if (newUnit.images.length === 0) {
      alert("Please select at least one image");
      return;
    }
    newUnit.images.forEach((img) => {
      data.append("image", img); // Matches req.files.image in your backend
    });

    addMutation.mutate(data);
  };
  const {
    data: mainProject,
    isPending,
    error,
  } = useQuery({
    queryKey: ["main-project", id],
    queryFn: async () => getSingleMainProject(id),
  });

  const { data: projectsData, isPending: projectsPending } = useQuery({
    queryKey: ["projects-for-main", id],
    queryFn: async () => getAllProjectsForMain(id),
  });

  if (isPending)
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {isRtl ? "جارٍ التحميل..." : "Loading..."}
      </motion.div>
    );
  if (error)
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {isRtl ? "المشروع غير موجود" : "Project not found"}
      </motion.div>
    );

  return (
    <motion.div
      className="min-h-screen bg-[#fafafa] pt-6 pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 py-10">
        <motion.button
          onClick={() => (window.location.href = `/${locale}`)}
          className="group mb-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white shadow-sm border border-slate-200 text-sm font-semibold text-slate-700 hover:shadow-md transition-all hover:border-blue-200"
          whileHover={{ x: isRtl ? 4 : -4 }}
        >
          <span className={isRtl ? "rotate-180" : ""}>←</span>
          {isRtl ? "العودة إلى الصفحة الرئيسية" : "Back to Home"}
        </motion.button>

        <motion.div
          className="mb-16 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900">
              {mainProject.title[locale]}
            </h1>
            <div className="h-1.5 w-24 bg-blue-600 rounded-full" />
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-medium border border-blue-100">
              <span className="text-lg">📍</span>
              {mainProject.location[locale]}
            </div>
            {/* Placeholder for extra detail like 'Type' or 'Status' */}
            <div className="text-slate-500 font-medium">
              {mainProject.type === "Residential"
                ? isRtl
                  ? "سكني"
                  : "Residential"
                : isRtl
                ? "تجاري"
                : "Commercial"}
            </div>
          </div>

          <p className="text-xl text-slate-600 leading-relaxed max-w-4xl font-light">
            {mainProject.description[locale]}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {mainProject.image.map((img: string, index: number) => (
            <motion.div
              key={index}
              className={`relative rounded-3xl overflow-hidden shadow-xl group cursor-zoom-in ${
                index === 0
                  ? "md:col-span-8 h-[500px]"
                  : "md:col-span-4 h-[500px]"
              }`}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src={img}
                alt={`${mainProject.title[locale]} ${index + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* Subtle Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </motion.div>

        <motion.section className="mt-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold text-slate-900">
              {isRtl ? "الوحدات المتاحة" : "Available Units"}
            </h2>

            {isAdmin && (
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-xl gap-2 bg-blue-600">
                    <Plus size={18} /> {isRtl ? "إضافة وحدة" : "Add Unit"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {isRtl ? "إضافة وحدة جديدة" : "Add New Unit"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddSubmit} className="space-y-4">
                    <Tabs defaultValue="en">
                      <TabsList className="w-full">
                        <TabsTrigger value="en" className="flex-1">
                          English
                        </TabsTrigger>
                        <TabsTrigger value="ar" className="flex-1">
                          العربية
                        </TabsTrigger>
                      </TabsList>

                      {["en", "ar"].map((lang) => (
                        <TabsContent
                          key={lang}
                          value={lang}
                          className="space-y-4 pt-4"
                        >
                          <div className="space-y-2">
                            <Label>Title ({lang.toUpperCase()})</Label>
                            <Input
                              value={newUnit.title[lang as "en" | "ar"]}
                              onChange={(e) =>
                                setNewUnit({
                                  ...newUnit,
                                  title: {
                                    ...newUnit.title,
                                    [lang]: e.target.value,
                                  },
                                })
                              }
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Location ({lang.toUpperCase()})</Label>
                              <Input
                                value={newUnit.location[lang as "en" | "ar"]}
                                onChange={(e) =>
                                  setNewUnit({
                                    ...newUnit,
                                    location: {
                                      ...newUnit.location,
                                      [lang]: e.target.value,
                                    },
                                  })
                                }
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Status ({lang.toUpperCase()})</Label>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={newUnit.status[lang as "en" | "ar"]}
                                onChange={(e) => {
                                  const val = e.target
                                    .value as keyof typeof STATUS_OPTIONS;
                                  const selected = STATUS_OPTIONS[val];

                                  if (selected) {
                                    setNewUnit({
                                      ...newUnit,
                                      status: {
                                        en: selected.en,
                                        ar: selected.ar,
                                      },
                                    });
                                  }
                                }}
                                required
                              >
                                {/* Display language-specific labels based on the current tab */}
                                <option
                                  value={lang === "en" ? "Completed" : "مكتمل"}
                                >
                                  {lang === "en" ? "Completed" : "مكتمل"}
                                </option>
                                <option
                                  value={
                                    lang === "en"
                                      ? "In Progress"
                                      : "قيد التنفيذ"
                                  }
                                >
                                  {lang === "en"
                                    ? "In Progress"
                                    : "قيد التنفيذ"}
                                </option>
                                <option
                                  value={lang === "en" ? "Planning" : "التخطيط"}
                                >
                                  {lang === "en" ? "Planning" : "التخطيط"}
                                </option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Description ({lang.toUpperCase()})</Label>
                            <Textarea
                              value={newUnit.description[lang as "en" | "ar"]}
                              onChange={(e) =>
                                setNewUnit({
                                  ...newUnit,
                                  description: {
                                    ...newUnit.description,
                                    [lang]: e.target.value,
                                  },
                                })
                              }
                              required
                            />
                          </div>

                          {/* Features Management */}
                          <div className="space-y-2">
                            <Label>Features ({lang.toUpperCase()})</Label>
                            <div className="flex gap-2">
                              <Input
                                value={featureInputs[lang as "en" | "ar"]}
                                onChange={(e) =>
                                  setFeatureInputs({
                                    ...featureInputs,
                                    [lang]: e.target.value,
                                  })
                                }
                                placeholder="Add a feature..."
                              />
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                  const val =
                                    featureInputs[lang as "en" | "ar"].trim();
                                  if (!val) return;
                                  setNewUnit({
                                    ...newUnit,
                                    features: {
                                      ...newUnit.features,
                                      [lang]: [
                                        ...newUnit.features[
                                          lang as "en" | "ar"
                                        ],
                                        val,
                                      ],
                                    },
                                  });
                                  setFeatureInputs({
                                    ...featureInputs,
                                    [lang]: "",
                                  });
                                }}
                              >
                                {" "}
                                Add{" "}
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {newUnit.features[lang as "en" | "ar"].map(
                                (f, i) => (
                                  <span
                                    key={i}
                                    className="bg-slate-100 px-2 py-1 rounded text-xs flex items-center gap-1"
                                  >
                                    {f}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const filtered = newUnit.features[
                                          lang as "en" | "ar"
                                        ].filter((_, idx) => idx !== i);
                                        setNewUnit({
                                          ...newUnit,
                                          features: {
                                            ...newUnit.features,
                                            [lang]: filtered,
                                          },
                                        });
                                      }}
                                    >
                                      ×
                                    </button>
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                    <div className="space-y-2">
                      <Label>Images</Label>
                      <Input
                        type="file"
                        multiple
                        onChange={(e) => {
                          if (e.target.files)
                            setNewUnit({
                              ...newUnit,
                              images: Array.from(e.target.files),
                            });
                        }}
                      />
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>{isRtl ? "غرف النوم" : "Bedrooms"}</Label>
                          <Input
                            type="number"
                            min="0"
                            value={newUnit.bedrooms}
                            onChange={(e) =>
                              setNewUnit({
                                ...newUnit,
                                bedrooms: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{isRtl ? "الحمامات" : "Bathrooms"}</Label>
                          <Input
                            type="number"
                            min="0"
                            value={newUnit.bathrooms}
                            onChange={(e) =>
                              setNewUnit({
                                ...newUnit,
                                bathrooms: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{isRtl ? "المساحة (م²)" : "Area (m²)"}</Label>
                          <Input
                            type="number"
                            min="0"
                            value={newUnit.area}
                            onChange={(e) =>
                              setNewUnit({
                                ...newUnit,
                                area: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Property Type</Label>
                          <select
                            className="w-full border rounded-md p-2 text-sm"
                            value={newUnit.type}
                            onChange={(e) =>
                              setNewUnit({
                                ...newUnit,
                                type: e.target.value as any,
                              })
                            }
                          >
                            <option value="Residential">Residential</option>
                            <option value="Commercial">Commercial</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Completion Date</Label>
                          <Input
                            type="date"
                            value={newUnit.completionDate}
                            onChange={(e) =>
                              setNewUnit({
                                ...newUnit,
                                completionDate: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={addMutation.isPending}
                    >
                      {addMutation.isPending ? "Adding..." : "Save Unit"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Grid of Units */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsData?.map((project: SmallProject) => (
              <ProjectCard key={project._id} {...project} />
            ))}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}

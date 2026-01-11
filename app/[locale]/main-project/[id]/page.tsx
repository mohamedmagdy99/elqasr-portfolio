"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as motion from "motion/react-client";
import { Plus, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

import {
  getSingleMainProject,
  getAllProjectsForMain,
} from "@/server/mainProjects";
import { CreateProject } from "@/server/Projects";
import { ProjectCard } from "@/app/(components)/ProjectCard/ProjectCard";

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

// --- TYPES ---

type ProjectType = "Residential" | "Commercial";

interface SmallProject {
  _id: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  location: { en: string; ar: string };
  status: { en: string; ar: string };
  type: ProjectType;
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
} as const;

export default function MainProjectPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;
  const locale = (params.locale as string) || "en";
  const isRtl = locale === "ar";

  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  // --- STATE ---
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [featureInputs, setFeatureInputs] = useState({ en: "", ar: "" });
  const [newUnit, setNewUnit] = useState({
    title: { en: "", ar: "" },
    description: { en: "", ar: "" },
    location: { en: "", ar: "" },
    status: { en: "Available", ar: "متاح" },
    type: "Residential" as ProjectType,
    completionDate: "",
    features: { en: [] as string[], ar: [] as string[] },
    images: [] as File[],
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
  });

  // --- QUERIES ---
  const {
    data: mainProject,
    isPending,
    error,
  } = useQuery({
    queryKey: ["main-project", id],
    queryFn: () => getSingleMainProject(id),
  });

  const { data: projectsData } = useQuery({
    queryKey: ["projects-for-main", id],
    queryFn: () => getAllProjectsForMain(id),
  });

  // --- MUTATIONS ---
  const addMutation = useMutation({
    mutationFn: (data: FormData) => CreateProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects-for-main", id] });
      setIsAddOpen(false);
      setNewUnit({
        title: { en: "", ar: "" },
        description: { en: "", ar: "" },
        location: { en: "", ar: "" },
        status: { en: "Available", ar: "متاح" },
        type: "Residential",
        completionDate: "",
        features: { en: [], ar: [] },
        images: [],
        bedrooms: 0,
        bathrooms: 0,
        area: 0,
      });
    },
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUnit.images.length === 0)
      return alert("Please select at least one image");

    const data = new FormData();
    data.append("mainProject", id);
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
    data.append("type", newUnit.type);

    if (newUnit.completionDate)
      data.append("completionDate", newUnit.completionDate);
    newUnit.features.en.forEach((f) => data.append("features[en][]", f));
    newUnit.features.ar.forEach((f) => data.append("features[ar][]", f));
    newUnit.images.forEach((img) => data.append("image", img));

    addMutation.mutate(data);
  };

  if (isPending)
    return (
      <div className="p-20 text-center">
        {isRtl ? "جارٍ التحميل..." : "Loading..."}
      </div>
    );
  if (error)
    return (
      <div className="p-20 text-center">
        {isRtl ? "المشروع غير موجود" : "Project not found"}
      </div>
    );

  return (
    <motion.div
      className="min-h-screen bg-[#fafafa] pt-6 pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Back Button */}
        <motion.button
          onClick={() => router.push(`/${locale}`)}
          className="group mb-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white shadow-sm border border-slate-200 text-sm font-semibold text-slate-700 hover:border-blue-200 transition-all"
          whileHover={{ x: isRtl ? 4 : -4 }}
        >
          {isRtl ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {isRtl ? "العودة إلى الصفحة الرئيسية" : "Back to Home"}
        </motion.button>

        {/* Project Header */}
        <header className="mb-16 space-y-6">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900">
              {mainProject.title[locale]}
            </h1>
            <div className="h-1.5 w-24 bg-blue-600 rounded-full" />
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-medium border border-blue-100">
              <MapPin size={18} />
              {mainProject.location[locale]}
            </div>
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
        </header>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16">
          {mainProject.image.map((img: string, index: number) => (
            <motion.div
              key={index}
              className={`relative rounded-3xl overflow-hidden shadow-xl group ${
                index === 0
                  ? "md:col-span-8 h-[500px]"
                  : "md:col-span-4 h-[500px]"
              }`}
              whileHover={{ y: -5 }}
            >
              <Image
                src={img}
                alt={`${mainProject.title[locale]} ${index + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          ))}
        </div>

        {/* Units Section */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold text-slate-900">
              {isRtl ? "الوحدات المتاحة" : "Available Units"}
            </h2>

            {isAdmin && (
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-xl gap-2 bg-blue-600 hover:bg-blue-700">
                    <Plus size={18} /> {isRtl ? "إضافة وحدة" : "Add Unit"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {isRtl ? "إضافة وحدة جديدة" : "Add New Unit"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddSubmit} className="space-y-6">
                    <Tabs defaultValue="en">
                      <TabsList className="w-full">
                        <TabsTrigger value="en" className="flex-1">
                          English
                        </TabsTrigger>
                        <TabsTrigger value="ar" className="flex-1">
                          العربية
                        </TabsTrigger>
                      </TabsList>

                      {(["en", "ar"] as const).map((lang) => (
                        <TabsContent
                          key={lang}
                          value={lang}
                          className="space-y-4 pt-4"
                        >
                          <div className="space-y-2">
                            <Label>Title ({lang.toUpperCase()})</Label>
                            <Input
                              value={newUnit.title[lang]}
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
                                value={newUnit.location[lang]}
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
                                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                                value={newUnit.status[lang]}
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
                              >
                                {Object.values(STATUS_OPTIONS).map((opt) => (
                                  <option key={opt.en} value={opt[lang]}>
                                    {opt[lang]}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Description ({lang.toUpperCase()})</Label>
                            <Textarea
                              value={newUnit.description[lang]}
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

                          {/* Features */}
                          <div className="space-y-2">
                            <Label>Features ({lang.toUpperCase()})</Label>
                            <div className="flex gap-2">
                              <Input
                                value={featureInputs[lang]}
                                onChange={(e) =>
                                  setFeatureInputs({
                                    ...featureInputs,
                                    [lang]: e.target.value,
                                  })
                                }
                                placeholder="e.g. Sea View"
                              />
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                  const val = featureInputs[lang].trim();
                                  if (!val) return;
                                  setNewUnit({
                                    ...newUnit,
                                    features: {
                                      ...newUnit.features,
                                      [lang]: [...newUnit.features[lang], val],
                                    },
                                  });
                                  setFeatureInputs({
                                    ...featureInputs,
                                    [lang]: "",
                                  });
                                }}
                              >
                                Add
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {newUnit.features[lang].map((f, i) => (
                                <span
                                  key={i}
                                  className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs flex items-center gap-1"
                                >
                                  {f}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const filtered = newUnit.features[
                                        lang
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
                              ))}
                            </div>
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Bedrooms</Label>
                        <Input
                          type="number"
                          value={newUnit.bedrooms}
                          onChange={(e) =>
                            setNewUnit({
                              ...newUnit,
                              bedrooms: +e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Bathrooms</Label>
                        <Input
                          type="number"
                          value={newUnit.bathrooms}
                          onChange={(e) =>
                            setNewUnit({
                              ...newUnit,
                              bathrooms: +e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Area (m²)</Label>
                        <Input
                          type="number"
                          value={newUnit.area}
                          onChange={(e) =>
                            setNewUnit({ ...newUnit, area: +e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <select
                          className="w-full h-10 px-3 rounded-md border"
                          value={newUnit.type}
                          onChange={(e) =>
                            setNewUnit({
                              ...newUnit,
                              type: e.target.value as ProjectType,
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

                    <div className="space-y-2">
                      <Label>Images</Label>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) =>
                          e.target.files &&
                          setNewUnit({
                            ...newUnit,
                            images: Array.from(e.target.files),
                          })
                        }
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={addMutation.isPending}
                    >
                      {addMutation.isPending ? "Saving..." : "Save Unit"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsData?.map((project: SmallProject) => (
              <ProjectCard key={project._id} {...project} />
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}

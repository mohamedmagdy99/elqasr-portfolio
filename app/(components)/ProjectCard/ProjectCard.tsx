"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  MapPin,
  Clock,
  Edit,
  Trash2,
  ChevronRight,
  Plus,
  X,
  ImageIcon,
  Layout,
  BedSingle,
  Bath,
  RulerDimensionLine,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UpdateProject, DeleteProject } from "@/server/Projects";
import { getAllMainProjects } from "@/server/mainProjects";

type LocaleKey = "en" | "ar";
type LocalizedString = { en: string; ar: string };
type LocalizedStringArray = { en: string[]; ar: string[] };
interface mainProject {
  _id: string;
  title: { en: string; ar: string };
  type: "Residential" | "Commercial";
  description: { en: string; ar: string };
  image: string[];
  state: string;
  location: { en: string; ar: string };
}
type ProjectCardProps = {
  _id: string;
  title: LocalizedString;
  description: LocalizedString;
  location: LocalizedString;
  status: LocalizedString;
  type: "Residential" | "Commercial";
  completionDate?: string;
  image: string[];
  features?: LocalizedStringArray;
  mainProject?: string; 
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  allMainProjects?: { _id: string; title: LocalizedString }[];
};

export const ProjectCard = ({
  _id,
  title,
  description,
  image,
  type,
  location,
  completionDate,
  status,
  features,
  bedrooms,
  bathrooms,
  area,
  mainProject,
}: ProjectCardProps) => {
  const locale = useLocale() as LocaleKey;
  const router = useRouter();
  const safeFeatures: LocalizedStringArray = features || { en: [], ar: [] };
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // ✅ Admin session
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const queryClient = useQueryClient();

  // ✅ Edit dialog
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<LocaleKey>("en");

  const [formData, setFormData] = useState({
    title: { ...title },
    description: { ...description },
    location: { ...location },
    status: { ...status },
    type,
    completionDate: completionDate || "",
    features: { ...safeFeatures },
    featureInput: "",
    bedrooms: bedrooms || 0,
    bathrooms: bathrooms || 0,
    area: area || 0,
    removedImages: [] as string[],
    images: [] as File[],
    mainProject: mainProject || "",
  });

  const displayedImages = image.filter(
    (img) => !formData.removedImages.includes(img)
  );
const { data: mainProjectsData } = useQuery({
  queryKey: ["main-projects-list"],
  queryFn: () => getAllMainProjects({ limit: 100 }), // High limit to see all options
});
  // ✅ Mutations
  const updateMutation = useMutation({
    mutationFn: (data: FormData) => UpdateProject(_id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project"] });
      setIsEditOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => DeleteProject(_id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title_en", formData.title.en);
    data.append("title_ar", formData.title.ar);
    data.append("description_en", formData.description.en);
    data.append("description_ar", formData.description.ar);
    data.append("location_en", formData.location.en);
    data.append("location_ar", formData.location.ar);
    data.append("status_en", formData.status.en);
    data.append("status_ar", formData.status.ar);
    data.append("type", formData.type);
    data.append("bedrooms", formData.bedrooms.toString());
    data.append("bathrooms", formData.bathrooms.toString());
    data.append("area", formData.area.toString());  
    if (formData.completionDate)
      data.append("completionDate", formData.completionDate);
    formData.features.en.forEach((f) => data.append("features_en[]", f));
    formData.features.ar.forEach((f) => data.append("features_ar[]", f));
    formData.images.forEach((f) => data.append("image", f));
    formData.removedImages.forEach((f) => data.append("removedImages", f));
    data.append("mainProject", formData.mainProject);
    updateMutation.mutate(data);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteMutation.mutate();
    }
  };

  const isRTL = locale === "ar";
  const localeKey = locale.startsWith("ar") ? "ar" : "en";

  const getStatusText = () => {
    if (!status) return "";
    const key = localeKey as "en" | "ar";
    if (typeof status === "string") return status;
    return status[key] || "";
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-full group"
    >
      <Card className="relative h-full flex flex-col overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500 bg-white rounded-3xl">
        {/* Visual Header */}
        <div className="relative h-72 overflow-hidden">
          <motion.div
            className="w-full h-full"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.7 }}
          >
            <Image
              src={image[0] || "/placeholder.png"}
              alt={title[locale]}
              fill
              className="object-cover transition-transform duration-500"
            />
          </motion.div>

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

          <div className="absolute top-4 inset-x-4 flex justify-between items-start">
            <Badge className="bg-white/95 text-primary hover:bg-white border-none shadow-sm backdrop-blur-md px-3 py-1 font-semibold rounded-full">
              {getStatusText()}
            </Badge>
            <Badge
              variant="outline"
              className="bg-black/20 text-white border-white/30 backdrop-blur-md rounded-full px-3 py-1"
            >
              {locale === "en"
                ? type
                : type === "Residential"
                ? "سكني"
                : "تجاري"}
            </Badge>
          </div>

          {image.length > 1 && (
            <button
              onClick={() => setIsGalleryOpen(true)}
              className="absolute bottom-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Info Content */}
        <CardHeader className="space-y-1 pb-2">
          <div className="flex items-center gap-2 text-primary font-medium text-xs uppercase tracking-wider mb-1">
            <Layout className="w-3.5 h-3.5" />
            {type}
          </div>
          <CardTitle className="text-2xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {title[locale]}
          </CardTitle>
          <CardDescription className="flex items-center gap-1.5 font-medium text-gray-500">
            <MapPin className="w-4 h-4 text-primary/70" />
            {location[locale]}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-grow pt-0">
          <p className="text-gray-600 leading-relaxed line-clamp-3 text-sm italic">
            "{description[locale]}"
          </p>
          <div className="flex items-center gap-4 mt-4">
            {bedrooms !== undefined && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <BedSingle />
                {bedrooms} {locale === "en" ? "Bedrooms" : "غرف نوم"}
              </div>
            )}
            {bathrooms !== undefined && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Bath />
                {bathrooms} {locale === "en" ? "Bathrooms" : "حمامات"}
              </div>
            )}
            {area !== undefined && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <RulerDimensionLine />
                {area} {locale === "en" ? "sq.m" : "م²"}
              </div>
            )}
          </div>
          {completionDate && (
            <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-gray-400 uppercase tracking-tight">
              <Clock className="w-3.5 h-3.5" />
              {new Date(completionDate).toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
              })}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-4 border-t border-gray-50 bg-gray-50/50">
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-6 shadow-md hover:shadow-lg transition-all group/btn"
            onClick={() => router.push(`/${locale}/Project/${_id}`)}
          >
            {locale === "en" ? "Explore Project" : "استكشاف المشروع"}
            <ChevronRight
              className={`w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1 ${
                isRTL ? "rotate-180" : ""
              }`}
            />
          </Button>

          {/* Admin Row */}
          {isAdmin && (
            <div className="grid grid-cols-2 gap-2 w-full">
              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-xl border-gray-200 hover:bg-white hover:border-primary hover:text-primary transition-all"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {locale === "en" ? "Edit" : "تعديل"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border-none shadow-2xl">
                  <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-2xl font-bold text-gray-800">
                      {locale === "en"
                        ? "Update Project Details"
                        : "تحديث بيانات المشروع"}
                    </DialogTitle>
                  </DialogHeader>

                  <form onSubmit={handleEditSubmit} className="space-y-6 pt-4">
                    <Tabs
                      value={activeTab}
                      onValueChange={(v) => setActiveTab(v as LocaleKey)}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-2xl">
                        <TabsTrigger
                          value="en"
                          className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        >
                          English
                        </TabsTrigger>
                        <TabsTrigger
                          value="ar"
                          className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        >
                          العربية
                        </TabsTrigger>
                      </TabsList>

                      {/* Multilingual Fields */}
                      {["en", "ar"].map((lang) => (
                        <TabsContent
                          key={lang}
                          value={lang}
                          className="space-y-4 mt-4 animate-in fade-in-50 duration-300"
                        >
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">
                              Project Title ({lang.toUpperCase()})
                            </Label>
                            <Input
                              className="rounded-xl border-gray-200 focus:ring-primary"
                              value={formData.title[lang as LocaleKey]}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  title: {
                                    ...formData.title,
                                    [lang]: e.target.value,
                                  },
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">
                              Description
                            </Label>
                            <Textarea
                              className="rounded-xl border-gray-200 min-h-[100px]"
                              value={formData.description[lang as LocaleKey]}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  description: {
                                    ...formData.description,
                                    [lang]: e.target.value,
                                  },
                                })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-semibold text-gray-700">
                                Location
                              </Label>
                              <Input
                                className="rounded-xl border-gray-200"
                                value={formData.location[lang as LocaleKey]}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    location: {
                                      ...formData.location,
                                      [lang]: e.target.value,
                                    },
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-semibold text-gray-700">
                                Status
                              </Label>
                              <Input
                                className="rounded-xl border-gray-200"
                                value={formData.status[lang as LocaleKey]}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    status: {
                                      ...formData.status,
                                      [lang]: e.target.value,
                                    },
                                  })
                                }
                              />
                            </div>
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">
                          Category
                        </Label>
                        <Select
                          value={formData.type}
                          onValueChange={(v: "Residential" | "Commercial") =>
                            setFormData({ ...formData, type: v })
                          }
                        >
                          <SelectTrigger className="rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Residential">
                              Residential
                            </SelectItem>
                            <SelectItem value="Commercial">
                              Commercial
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">
                          Bedrooms
                        </Label>
                        <Input
                          type="number"
                          className="rounded-xl"
                          value={formData.bedrooms}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              bedrooms: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">
                          Bathrooms
                        </Label>
                        <Input
                          type="number"
                          className="rounded-xl"
                          value={formData.bathrooms}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              bathrooms: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">
                          Area (sq.m)
                        </Label>
                        <Input
                          type="number"
                          className="rounded-xl"
                          value={formData.area}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              area: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">
                          Date
                        </Label>
                        <Input
                          type="date"
                          className="rounded-xl"
                          value={formData.completionDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              completionDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">
                          Parent Main Project
                        </Label>
                        <Select
                          value={formData.mainProject}
                          onValueChange={(v) =>
                            setFormData({ ...formData, mainProject: v })
                          }
                        >
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select Main Project" />
                          </SelectTrigger>
                          <SelectContent>
                            {mainProjectsData?.data.map((proj: mainProject) => (
                              <SelectItem key={proj._id} value={proj._id}>
                                {proj.title[locale]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Dynamic Features UI */}
                    <div className="space-y-3 p-4 bg-gray-50 rounded-2xl">
                      <Label className="text-sm font-bold">
                        Key Features ({activeTab})
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a feature..."
                          className="rounded-xl bg-white"
                          value={formData.featureInput}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              featureInput: e.target.value,
                            })
                          }
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            if (!formData.featureInput.trim()) return;
                            setFormData({
                              ...formData,
                              features: {
                                ...formData.features,
                                [activeTab]: [
                                  ...formData.features[activeTab],
                                  formData.featureInput.trim(),
                                ],
                              },
                              featureInput: "",
                            });
                          }}
                          className="rounded-xl bg-black text-white hover:bg-gray-800"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.features[activeTab].map((feat, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="pl-3 pr-1 py-1 rounded-full bg-white border flex items-center gap-1 group"
                          >
                            {feat}
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  features: {
                                    ...formData.features,
                                    [activeTab]: formData.features[
                                      activeTab
                                    ].filter((_, idx) => idx !== i),
                                  },
                                })
                              }
                              className="p-0.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Image Management */}
                    <div className="space-y-4">
                      <Label className="text-sm font-bold">Project Media</Label>
                      <div className="grid grid-cols-4 gap-3">
                        {/* New Upload Trigger */}
                        <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all text-gray-400 hover:text-primary">
                          <Plus className="w-6 h-6 mb-1" />
                          <span className="text-[10px] font-bold uppercase">
                            Upload
                          </span>
                          <input
                            type="file"
                            multiple
                            hidden
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                images: e.target.files
                                  ? [
                                      ...formData.images,
                                      ...Array.from(e.target.files),
                                    ]
                                  : formData.images,
                              })
                            }
                          />
                        </label>

                        {/* Existing Images */}
                        {displayedImages.map((img, i) => (
                          <div
                            key={i}
                            className="relative aspect-square rounded-2xl overflow-hidden group/img"
                          >
                            <Image
                              src={img}
                              alt="project"
                              fill
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  removedImages: [
                                    ...formData.removedImages,
                                    img,
                                  ],
                                })
                              }
                              className="absolute inset-0 bg-red-500/80 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white transition-opacity"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        ))}

                        {/* Preview Pending Images */}
                        {formData.images.map((file, i) => (
                          <div
                            key={i}
                            className="relative aspect-square rounded-2xl overflow-hidden"
                          >
                            <Image
                              src={URL.createObjectURL(file)}
                              alt="preview"
                              fill
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  images: formData.images.filter(
                                    (_, idx) => idx !== i
                                  ),
                                })
                              }
                              className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0 border-t pt-6">
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={() => setIsEditOpen(false)}
                        className="rounded-xl"
                      >
                        Discard Changes
                      </Button>
                      <Button
                        type="submit"
                        disabled={updateMutation.status === "pending"}
                        className="rounded-xl px-8 bg-primary hover:bg-primary/90"
                      >
                        {updateMutation.status === "pending"
                          ? "Syncing..."
                          : "Update Project"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Button
                variant="destructive"
                className="rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border-none transition-all shadow-none"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {locale === "en" ? "Delete" : "حذف"}
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Modern Gallery Modal */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-5xl p-2 bg-transparent border-none shadow-none">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {image.map((img, idx) => (
              <motion.div
                key={idx}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white/10"
                whileHover={{ scale: 0.98 }}
              >
                <Image
                  src={img}
                  alt={`${title[locale]} - ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </motion.div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

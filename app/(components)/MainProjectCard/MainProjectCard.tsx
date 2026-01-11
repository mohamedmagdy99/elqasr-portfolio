"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Building2,
  Edit,
  Trash2,
  X,
  Plus,
  ImageIcon,
  ArrowUpRight,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useLocale } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { updateMainProject, deleteMainProject } from "@/server/mainProjects";

interface ProjectCardProps {
  _id: string;
  title: { en: string; ar: string };
  type: string;
  description: { en: string; ar: string };
  image: string[];
  state: "available" | "sold";
  location: { en: string; ar: string };
}

export const MainProjectCard = ({
  _id,
  title,
  type,
  description,
  image,
  state,
  location,
}: ProjectCardProps) => {
  const locale = useLocale() as "en" | "ar";
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"en" | "ar">(locale);

  // --- Form State ---
  const [formData, setFormData] = useState({
    title: { ...title },
    description: { ...description },
    location: { ...location },
    state: state,
    type: type,
    removedImages: [] as string[],
    newFiles: [] as File[],
  });

  // --- Mutations ---
  const updateMutation = useMutation({
    mutationFn: (data: FormData) => updateMainProject(_id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsEditOpen(false);
      setFormData((prev) => ({ ...prev, removedImages: [], newFiles: [] }));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteMainProject(_id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    // Flattening objects for the backend parser
    data.append("title_en", formData.title.en);
    data.append("title_ar", formData.title.ar);
    data.append("description_en", formData.description.en);
    data.append("description_ar", formData.description.ar);
    data.append("location_en", formData.location.en);
    data.append("location_ar", formData.location.ar);
    data.append("state", formData.state);
    data.append("type", formData.type);

    // Images
    formData.removedImages.forEach((url) => data.append("removedImages", url));
    formData.newFiles.forEach((file) => data.append("image", file));

    updateMutation.mutate(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        newFiles: [...formData.newFiles, ...Array.from(e.target.files)],
      });
    }
  };

  // Filter out images that are marked for removal for UI preview
  const currentImagesPreview = image.filter(
    (img) => !formData.removedImages.includes(img)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500"
    >
      {/* Visual Card Content */}
      <div className="relative h-72 overflow-hidden">
        <Image
          // Fallback to a placeholder if image[0] is undefined
          src={image?.[0] || "/placeholder-project.jpg"}
          alt={title[locale] || "Project Image"}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          // Optional: add priority if these cards are at the top of the page
          priority={false}
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
          {type}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {title[locale]}
        </h3>
        <div className="flex items-center text-gray-500 mb-4 gap-2">
          <MapPin size={18} className="text-blue-600" />
          <span className="text-sm">{location[locale]}</span>
        </div>
        <p className="text-gray-600 line-clamp-2 mb-6 text-sm leading-relaxed">
          {description[locale]}
        </p>
        <Link href={`/main-project/${_id}`} passHref>
          <Button
            variant="ghost"
            className="w-full justify-between hover:bg-blue-50 text-blue-600 font-semibold rounded-xl group/btn"
          >
            {locale === "ar" ? "استكشف المشروع" : "Explore Project"}
            <ArrowUpRight
              className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
              size={20}
            />
          </Button>
        </Link>
      </div>

      {/* Admin Actions */}
      {isAdmin && (
        <div className="flex gap-2 p-6 pt-0 mt-auto">
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1 rounded-xl gap-2">
                <Edit size={16} /> Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Update {title.en}</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleEditSubmit} className="space-y-6">
                <Tabs
                  value={activeTab}
                  onValueChange={(v: any) => setActiveTab(v)}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="ar">العربية</TabsTrigger>
                  </TabsList>
                  {["en", "ar"].map((lang) => (
                    <TabsContent
                      key={lang}
                      value={lang}
                      className="space-y-4 pt-4"
                    >
                      <div className="space-y-2">
                        <Label>Project Title</Label>
                        <Input
                          value={formData.title[lang as "en" | "ar"]}
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
                        <Label>Location</Label>
                        <Input
                          value={formData.location[lang as "en" | "ar"]}
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
                        <Label>Description</Label>
                        <Textarea
                          rows={4}
                          value={formData.description[lang as "en" | "ar"]}
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
                    </TabsContent>
                  ))}
                </Tabs>

                {/* MEDIA MANAGEMENT SECTION */}
                <div className="space-y-3">
                  <Label className="text-base font-bold flex items-center gap-2">
                    <ImageIcon size={18} /> Media Gallery
                  </Label>
                  <div className="grid grid-cols-4 gap-3 border p-4 rounded-2xl bg-gray-50/50">
                    {/* Upload Trigger */}
                    <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                      <Plus size={24} className="text-gray-400" />
                      <span className="text-[10px] uppercase font-bold text-gray-500 mt-1">
                        Upload
                      </span>
                      <input
                        type="file"
                        multiple
                        hidden
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </label>

                    {/* Existing Images */}
                    {currentImagesPreview.map((url, idx) => (
                      <div
                        key={`old-${idx}`}
                        className="relative aspect-square rounded-xl overflow-hidden group shadow-sm"
                      >
                        <Image
                          src={url}
                          alt="project"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              removedImages: [...formData.removedImages, url],
                            })
                          }
                          className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}

                    {/* New Files Preview */}
                    {formData.newFiles.map((file, idx) => (
                      <div
                        key={`new-${idx}`}
                        className="relative aspect-square rounded-xl overflow-hidden border-2 border-blue-500 shadow-md"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt="new"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              newFiles: formData.newFiles.filter(
                                (_, i) => i !== idx
                              ),
                            })
                          }
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={12} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-[8px] text-white text-center py-0.5">
                          NEW
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Project State</Label>
                    <Select
                      value={formData.state}
                      onValueChange={(v: any) =>
                        setFormData({ ...formData, state: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Property Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(v) =>
                        setFormData({ ...formData, type: v })
                      }
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Residential">Residential</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter className="pt-4 border-t">
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg rounded-xl"
                  >
                    {updateMutation.isPending
                      ? "Syncing with S3..."
                      : "Save Changes"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Button
            variant="destructive"
            onClick={() => {
              if (confirm("Are you sure?")) deleteMutation.mutate();
            }}
            className="flex-1 rounded-xl gap-2"
          >
            <Trash2 size={16} /> Delete
          </Button>
        </div>
      )}
    </motion.div>
  );
};

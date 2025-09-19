"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { MapPin, Clock, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"; // assume Tabs components exist in your UI library
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateProject, DeleteProject } from "@/server/Projects";

type LocaleKey = "en" | "ar";
type LocalizedString = { en: string; ar: string };
type LocalizedStringArray = { en: string[]; ar: string[] };

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
        removedImages: [] as string[],
        images: [] as File[],
    });

    const displayedImages = image.filter(img => !formData.removedImages.includes(img));

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

        // Append multi-lang fields
        data.append("title_en", formData.title.en);
        data.append("title_ar", formData.title.ar);
        data.append("description_en", formData.description.en);
        data.append("description_ar", formData.description.ar);
        data.append("location_en", formData.location.en);
        data.append("location_ar", formData.location.ar);
        data.append("status_en", formData.status.en);
        data.append("status_ar", formData.status.ar);
        data.append("type", formData.type);
        if (formData.completionDate) data.append("completionDate", formData.completionDate);

        // Features
        formData.features.en.forEach(f => data.append("features_en[]", f));
        formData.features.ar.forEach(f => data.append("features_ar[]", f));

        // Images
        formData.images.forEach(f => data.append("image", f));
        formData.removedImages.forEach(f => data.append("removedImages", f));

        updateMutation.mutate(data);
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this project?")) {
            deleteMutation.mutate();
        }
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" },
    };
    const localeKey = locale.startsWith("ar") ? "ar" : "en"; // fallback

    const getStatusText = () => {
        if (!status) return "";
        const key = localeKey as "en" | "ar";
        if (typeof status === "string") return status;
        if (status[key] && typeof status[key] === "string") return status[key];
        return "";
    };
    return (
        <motion.div
            layout
            variants={fadeInUp}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5 }}
            className="h-full"
        >
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full rounded-2xl">
                {/* Image + Badges */}
                <div className="relative">
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                        <Image
                            src={image[0] || "/placeholder.png"}
                            alt={title[locale]}
                            width={800}
                            height={400}
                            className="w-full h-64 object-cover"
                        />
                    </motion.div>

                    <div className="absolute top-4 left-4">
                        <Badge>{getStatusText()}</Badge>
                    </div>

                    <div className="absolute top-4 right-4">
                        <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
                            {locale === "en" ? type : type === "Residential" ? "سكني" : "تجاري"}
                        </Badge>
                    </div>
                </div>

                {/* Content */}
                <CardHeader>
                    <CardTitle className="line-clamp-2">{title[locale]}</CardTitle>
                    <CardDescription className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        {location[locale]}
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex-grow">
                    <p className="text-gray-600 line-clamp-3">{description[locale]}</p>
                    {completionDate && (
                        <div className="flex items-center mt-4 text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
                            {new Date(completionDate).toLocaleDateString(locale)}
                        </div>
                    )}
                </CardContent>

                {/* Footer */}
                <CardFooter className="space-y-2 flex flex-col">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => router.push(`/${locale}/Project/${_id}`)}
                    >
                        {locale === "en" ? "View Details" : "عرض التفاصيل"}
                    </Button>

                    {image.length > 1 && (
                        <Button variant="ghost" size="sm" className="w-full" onClick={() => setIsGalleryOpen(true)}>
                            {locale === "en" ? "View Gallery" : "عرض المعرض"}
                        </Button>
                    )}

                    {/* Admin Controls */}
                    {isAdmin && (
                        <div className="flex gap-2 mt-2">
                            {/* Edit */}
                            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                                <DialogTrigger asChild>
                                    <Button className="flex-1 flex items-center justify-center gap-1">
                                        <Edit className="w-4 h-4" /> {locale === "en" ? "Edit" : "تعديل"}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>{locale === "en" ? "Edit Project" : "تعديل المشروع"}</DialogTitle>
                                    </DialogHeader>

                                    {/* Tabs for EN/AR */}
                                    <form onSubmit={handleEditSubmit} className="space-y-4">
                                        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as LocaleKey)}>
                                            <TabsList className="flex flex-wrap gap-2">
                                                <TabsTrigger value="en">English</TabsTrigger>
                                                <TabsTrigger value="ar">Arabic</TabsTrigger>
                                            </TabsList>

                                            <TabsContent value="en"  className="space-y-3">
                                                <div>
                                                    <Label>Title</Label>
                                                    <Input value={formData.title.en} onChange={(e) => setFormData({...formData, title: {...formData.title, en: e.target.value}})} />
                                                </div>
                                                <div>
                                                    <Label>Description</Label>
                                                    <Textarea value={formData.description.en} onChange={(e) => setFormData({...formData, description: {...formData.description, en: e.target.value}})} />
                                                </div>
                                                <div>
                                                    <Label>Location</Label>
                                                    <Input value={formData.location.en} onChange={(e) => setFormData({...formData, location: {...formData.location, en: e.target.value}})} />
                                                </div>
                                                <div>
                                                    <Label>Status</Label>
                                                    <Input value={formData.status.en} onChange={(e) => setFormData({...formData, status: {...formData.status, en: e.target.value}})} />
                                                </div>
                                            </TabsContent>

                                            <TabsContent value="ar" className="space-y-3">
                                                <div>
                                                    <Label>العنوان</Label>
                                                    <Input value={formData.title.ar} onChange={(e) => setFormData({...formData, title: {...formData.title, ar: e.target.value}})} />
                                                </div>
                                                <div>
                                                    <Label>الوصف</Label>
                                                    <Textarea value={formData.description.ar} onChange={(e) => setFormData({...formData, description: {...formData.description, ar: e.target.value}})} />
                                                </div>
                                                <div>
                                                    <Label>الموقع</Label>
                                                    <Input value={formData.location.ar} onChange={(e) => setFormData({...formData, location: {...formData.location, ar: e.target.value}})} />
                                                </div>
                                                <div>
                                                    <Label>الحالة</Label>
                                                    <Input value={formData.status.ar} onChange={(e) => setFormData({...formData, status: {...formData.status, ar: e.target.value}})} />
                                                </div>
                                            </TabsContent>
                                        </Tabs>

                                        <div>
                                            <Label>Type</Label>
                                            <Select value={formData.type} onValueChange={(v: "Residential" | "Commercial") => setFormData({...formData, type: v})}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Residential">Residential</SelectItem>
                                                    <SelectItem value="Commercial">Commercial</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label>Completion Date</Label>
                                            <Input type="date" value={formData.completionDate} onChange={(e) => setFormData({...formData, completionDate: e.target.value})} />
                                        </div>

                                        <div>
                                            <Label>Features</Label>
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <Input value={formData.featureInput} onChange={e => setFormData({...formData, featureInput: e.target.value})} />
                                                <Button type="button" onClick={() => {
                                                    if (!formData.featureInput.trim()) return;
                                                    setFormData({...formData, features: {...formData.features, [activeTab]: [...formData.features[activeTab], formData.featureInput.trim()]}, featureInput: ""});
                                                }}>Add</Button>
                                            </div>
                                            <div className="flex gap-2 mt-2 flex-wrap">
                                                {formData.features[activeTab].map((feat, i) => (
                                                    <span key={i} className="px-3 py-1 bg-gray-200 rounded-full flex items-center gap-2">
          {feat}
                                                        <button type="button" onClick={() => setFormData({...formData, features: {...formData.features, [activeTab]: formData.features[activeTab].filter((_, idx) => idx !== i)}})} className="text-red-500 hover:text-red-700">✕</button>
        </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <Label>Upload Images</Label>
                                            <Input type="file" multiple onChange={(e) => setFormData({...formData, images: e.target.files ? Array.from(e.target.files) : []})} />
                                            <div className="flex gap-2 mt-2 flex-wrap">
                                                {formData.images.map((file, i) => (
                                                    <div key={i} className="relative w-24 h-24 bg-gray-100 flex items-center justify-center rounded">
                                                        <span className="text-sm">{file.name}</span>
                                                        <button type="button" onClick={() => setFormData({...formData, images: formData.images.filter((_, idx) => idx !== i)})} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-700">✕</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 flex-wrap">
                                            {displayedImages.map((img, i) => (
                                                <div key={i} className="relative w-24 h-24 bg-gray-100 flex items-center justify-center rounded">
                                                    <Image src={img} alt="existing" fill style={{ objectFit: "cover" }} />
                                                    <button type="button" onClick={() => setFormData({...formData, removedImages: [...formData.removedImages, img]})} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-700">✕</button>
                                                </div>
                                            ))}
                                        </div>

                                        <DialogFooter className="flex flex-col sm:flex-row gap-2">
                                            <Button variant="outline" type="button" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                                            <Button type="submit" disabled={updateMutation.status === "pending"}  className="flex-1">{updateMutation.status === "pending" ? "Saving..." : "Save"}</Button>
                                        </DialogFooter>
                                    </form>

                                </DialogContent>
                            </Dialog>

                            {/* Delete */}
                            <Button variant="destructive" className="flex-1 flex items-center justify-center gap-1 mt-2 sm:mt-0" onClick={handleDelete}>
                                <Trash2 className="w-4 h-4" /> {locale === "en" ? "Delete" : "حذف"}
                            </Button>
                        </div>
                    )}
                </CardFooter>
            </Card>

            {/* Gallery */}
            <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
                <DialogContent className="w-full max-w-full sm:max-w-3xl p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {image.map((img, idx) => (
                            <div key={idx}  className="relative w-full h-48 sm:h-56 md:h-64">
                                <Image src={img} alt={`${title[locale]} - ${idx + 1}`} fill className="object-cover rounded-lg" />
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
};


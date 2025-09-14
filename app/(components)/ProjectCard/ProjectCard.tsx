"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import * as motion from "motion/react-client";
import Image from 'next/image';
import { Home, ShoppingBag, MapPin, Clock, Edit, Trash2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateProject, DeleteProject } from "@/server/Projects"; // your API calls

interface ProjectCardProps {
    _id: string;
    title: string;
    type: 'Residential' | 'Commercial';
    description: string;
    image: string[];
    status: 'completed' | 'in-progress' | 'Planning';
    location: string;
    completionDate?: string;
    features?: string[];
}
type ProjectType = "Residential" | "Commercial";
type ProjectStatus = "completed" | "in-progress" | "Planning";

const ProjectCard = ({ _id, title, description, image, type, location, completionDate, status, features = [] }: ProjectCardProps) => {
    const router = useRouter();
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === "admin";
    const queryClient = useQueryClient();

    // Dialog state
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title,
        type,
        description,
        location,
        status,
        completionDate: completionDate || "",
        features: [...features],
        featureInput: "",
        images: [] as File[],
    });

    // Mutations
    const updateMutation = useMutation({
        mutationFn: (data: FormData) => UpdateProject(_id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project"] });
            setIsEditOpen(false);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: () => DeleteProject(_id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
    });

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("type", formData.type);
        data.append("status", formData.status);
        data.append("location", formData.location);
        if (formData.completionDate) data.append("completionDate", formData.completionDate);
        formData.features.forEach(f => data.append("features[]", f));
        formData.images.forEach(f => data.append("image", f));

        updateMutation.mutate(data);
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this project?")) {
            deleteMutation.mutate();
        }
    };

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} className="overflow-hidden h-[250px] relative">
                    {image.map((img, i) => (
                        <Image key={i} src={img} alt={title} fill style={{ objectFit: 'cover' }} />
                    ))}
                </motion.div>

                <div className="absolute top-4 left-4">
                    <Badge variant="default">
                        {status === 'completed' ? 'Completed' : status === 'in-progress' ? 'In Progress' : 'Planning'}
                    </Badge>
                </div>
                <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-white">
                        {type === 'Residential' ? <Home className="w-3 h-3 mr-1" /> : <ShoppingBag className="w-3 h-3 mr-1" />}
                        {type}
                    </Badge>
                </div>
            </div>

            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {location}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <p className="whitespace-pre-wrap break-words line-clamp-3">{description}</p>
                {completionDate && (
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        Completed: {completionDate}
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
                <Button variant="outline" className="w-full" onClick={() => router.push(`/Project/${_id}`)}>View Details</Button>

                {isAdmin && (
                    <div className="flex gap-2 mt-2">
                        {/* Edit Dialog */}
                        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                            <DialogTrigger asChild>
                                <Button className="flex-1 flex items-center justify-center gap-1">
                                    <Edit className="w-4 h-4" /> Edit
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Edit Project</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleEditSubmit} className="space-y-4">
                                    {/* Include all your form fields here, same as Add Project form */}
                                    <div>
                                        <Label htmlFor="title">Project Title *</Label>
                                        <Input id="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                                    </div>
                                    <div>
                                        <Label htmlFor="type">Type</Label>
                                        <Select value={formData.type} onValueChange={(value: ProjectType) => setFormData({...formData, type: value})}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Residential">Residential</SelectItem>
                                                <SelectItem value="Commercial">Commercial</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="location">Location</Label>
                                        <Input id="location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                                    </div>
                                    <div>
                                        <Label htmlFor="status">Status</Label>
                                        <Select value={formData.status} onValueChange={(value: ProjectStatus) => setFormData({...formData, status: value})}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Planning">Planning</SelectItem>
                                                <SelectItem value="in-progress">In Progress</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                                    </div>
                                    <div>
                                        <Label htmlFor="completionDate">Completion Date</Label>
                                        <Input type="date" value={formData.completionDate} onChange={e => setFormData({...formData, completionDate: e.target.value})} />
                                    </div>
                                    <div>
                                        <Label>Features</Label>
                                        <div className="flex gap-2">
                                            <Input value={formData.featureInput} onChange={e => setFormData({...formData, featureInput: e.target.value})} />
                                            <Button type="button" onClick={() => {
                                                if (formData.featureInput.trim()) {
                                                    setFormData({...formData, features: [...formData.features, formData.featureInput.trim()], featureInput: ""})
                                                }
                                            }}>Add</Button>
                                        </div>
                                        <div className="flex gap-2 mt-2 flex-wrap">
                                            {formData.features.map((feat,i) => (
                                                <span key={i} className="px-3 py-1 bg-gray-200 rounded-full flex items-center gap-2">
                                                    {feat}
                                                    <button type="button" onClick={() => setFormData({...formData, features: formData.features.filter((_,idx) => idx !== i)})} className="text-red-500 hover:text-red-700">✕</button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <Button variant="outline" type="button" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                                        <Button type="submit" disabled={updateMutation.status === "pending"}>
                                                {updateMutation.status === "pending" ? "Saving..." : "Save"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>

                        {/* Delete */}
                        <Button variant="destructive" className="flex-1 flex items-center justify-center gap-1" onClick={handleDelete}>
                            <Trash2 className="w-4 h-4" /> Delete
                        </Button>
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}

export default ProjectCard;

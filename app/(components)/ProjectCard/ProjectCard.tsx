import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import * as motion from "motion/react-client";
import Image from 'next/image';
import {Home, ShoppingBag,MapPin,Clock} from "lucide-react"
interface ProjectcardProps {
    title: string;
    type: 'home' | 'mall';
    description: string;
    image: string;
    status: 'completed' | 'in-progress' | 'planning';
    location: string;
    completionDate?: string;
}

const ProjectCard = ({title,description,image,type,location,completionDate,status}:ProjectcardProps) => {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden h-[250px] relative"
                >
                    <div className="absolute inset-0">
                        <Image
                            src={image}
                            alt={title}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="w-full h-full"
                        />
                    </div>
                </motion.div>

                <div className="absolute top-4 left-4">
                    <Badge variant={status==='completed'? 'default': status === 'in-progress' ? 'secondary' : 'destructive'}>
                        {status === 'completed' ? 'Completed' : status === 'in-progress' ? 'In Progress' : 'Planning'}
                    </Badge>
                </div>
                <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-white">
                        {type === 'home' ? <Home className="w-3 h-3 mr-1" /> : <ShoppingBag className="w-3 h-3 mr-1" />}
                        {type === 'home' ? 'Residential' : 'Commercial'}
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
                <p className="text-gray-600">{description}</p>
                {completionDate && (
                    <div className="flex items-center mt-4 text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        Completed: {completionDate}
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full">View Details</Button>
            </CardFooter>
        </Card>
    )
}
export default ProjectCard

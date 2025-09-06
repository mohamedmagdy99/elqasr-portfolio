import { ReactElement } from "react";

import * as motion from "motion/react-client";
import { Card, CardContent,  CardHeader, CardTitle } from '@/components/ui/card';
interface ContactProps {
    Title: string,
    Description?: string,
    Content:string,
    icon:ReactElement,
    Delay?:number,
}
const ContactCard = ({Title,Description,Content,icon,Delay}:ContactProps) => {
    const scaleIn = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5, ease: "easeOut" }
    };
    return (
        <motion.div
            variants={scaleIn}
            whileHover={{y:-5}}
        >
            <Card>
                <CardHeader className="text-center">
                    <motion.div
                        animate={{ rotate:[0, 5, -5, 0] }}
                        transition={{duration: 2,repeat: Infinity,repeatDelay:3, delay:Delay?Delay:0}}
                    >
                        {icon}
                    </motion.div>
                    <CardTitle>
                        {Title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-gray-600">{Content}</p>
                    {Description && <p className="text-sm text-gray-500 mt-2">{Description}</p>}
                </CardContent>
            </Card>
        </motion.div>
    )
}
export default ContactCard

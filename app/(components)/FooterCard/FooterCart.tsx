import React from 'react'
import * as motion from "motion/react-client";
interface FooterProps{
    Title:string,
    list:string[],
}
const FooterCart = ({Title, list}:FooterProps) => {
    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    return (
        <motion.div
            variants={fadeInUp}
        >
            <h3 className="font-semibold mb-4">{Title}</h3>
            <ul className="space-y-2 text-gray-400">
                {list.map((item,index)=>(
                    <li key={index}>
                        {item}
                    </li>
                ))}
            </ul>
        </motion.div>
    )
}
export default FooterCart

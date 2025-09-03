"use client"
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
const AnimatedCounter = ({ target, duration = 1 }: { target: number; duration?: number }) => {
    const [count, setCount] = useState<number>(0);
    const controls = useAnimation();

    useEffect(() => {
        controls.start({
            count: target,
            transition: { duration, ease: "easeOut" },
        });
    }, [target, duration, controls]);

    useEffect(() => {
        const start:number = performance.now();
        const step=(timestamp: number) => {
            const progress:number = Math.min((timestamp - start) / (duration * 1000), 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, duration]);

    return (
        <motion.div
            className="text-4xl font-bold text-blue-600 mb-2"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            {count}+
        </motion.div>
    );
};
export default AnimatedCounter

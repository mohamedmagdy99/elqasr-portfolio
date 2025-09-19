// components/AnimatedCounter/AnimatedCounter.tsx
"use client"
import { motion } from "framer-motion"; // Keep motion for the wrapper div
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

const AnimatedCounter = ({ target, duration = 1 }: { target: number; duration?: number }) => {
    const [count, setCount] = useState<number>(0);
    const locale = useLocale();

    useEffect(() => {
        const start: number = performance.now();
        const end = start + duration * 1000;

        const step = (timestamp: number) => {
            const progress: number = Math.min((timestamp - start) / (end - start), 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);

        // Cleanup function to prevent memory leaks
        return () => {
            setCount(0);
        };
    }, [target, duration, locale]); // Add locale as a dependency

    // Format the number based on the current locale
    const formattedCount = new Intl.NumberFormat(locale).format(count);

    return (
        <motion.div
            className="text-4xl font-bold text-blue-600 mb-2"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            {formattedCount}+
        </motion.div>
    );
};
export default AnimatedCounter;
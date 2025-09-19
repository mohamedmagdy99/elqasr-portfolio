// components/GallerySlider/GallerySlider.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { getAllImages } from "@/server/Images";
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

const GallerySlider = () => {
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [modalImage, setModalImage] = useState<string | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const { data, isLoading } = useQuery({ queryKey: ['gallery'], queryFn: getAllImages });

    const t = useTranslations('GallerySlider');
    const locale = useLocale();
    const isRtl = locale === 'ar';

    const handlePrev = () => {
        if (!Array.isArray(data) || data.length === 0) return;
        setCurrent((prev) => (prev === 0 ? data.length - 1 : prev - 1));
    };

    const handleNext = () => {
        if (!Array.isArray(data) || data.length === 0) return;
        setCurrent((prev) => (prev === data.length - 1 ? 0 : prev + 1));
    };

    useEffect(() => {
        if (!isPaused && Array.isArray(data) && data.length > 0) {
            intervalRef.current = setInterval(() => {
                setCurrent((prev) => (prev === data.length - 1 ? 0 : prev + 1));
            }, 3000);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPaused, data]);

    useEffect(() => {
        if (Array.isArray(data) && data.length > 0) {
            setCurrent(0);
        }
    }, [data]);

    return (
        <div
            className="max-w-6xl mx-auto py-12 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            dir={isRtl ? 'rtl' : 'ltr'}
        >
            {/* Heading */}
            <motion.h2
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold text-center mb-8"
            >
                {t('heading')}
            </motion.h2>

            {/* Slider with arrows */}
            <div className="relative flex items-center justify-center">
                {/* Left Arrow (positioning depends on RTL/LTR) */}
                <button
                    onClick={isRtl ? handleNext : handlePrev}
                    className={`absolute z-30 p-2 bg-gray-200 hover:bg-gray-300 rounded-full ${isRtl ? 'right-0' : 'left-0'}`}
                >
                    {isRtl ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
                </button>

                {/* Image Slider */}
                <div className="flex items-center justify-center gap-4 overflow-hidden">
                    {isLoading ? (
                        <div className="col-span-full flex justify-center items-center min-h-[200px]">
                            <Spinner className="text-blue-500" size={64} />
                        </div>
                    ) : (
                        Array.isArray(data) && data.map((imgObj: { image: string }, index: number) => {
                            const img = imgObj.image;
                            const isCenter = index === current;
                            const isLeft = index === (current === 0 ? data.length - 1 : current - 1);
                            const isRight = index === (current === data.length - 1 ? 0 : current + 1);

                            if (!isCenter && !isLeft && !isRight) return null;

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{
                                        opacity: 1,
                                        scale: isCenter ? 1 : 0.8,
                                        filter: isCenter ? 'blur(0px)' : 'blur(2px)',
                                    }}
                                    transition={{ duration: 0.5 }}
                                    className={`relative h-64 w-64 rounded-xl overflow-hidden shadow-xl cursor-pointer ${
                                        isCenter ? 'z-20' : 'z-10 opacity-70'
                                    }`}
                                    onClick={() => setModalImage(img)}
                                >
                                    <Image
                                        src={img}
                                        alt={t('image_alt')}
                                        fill
                                        className="object-cover"
                                        sizes="256px"
                                    />
                                </motion.div>
                            );
                        })
                    )}
                </div>

                {/* Right Arrow (positioning depends on RTL/LTR) */}
                <button
                    onClick={isRtl ? handlePrev : handleNext}
                    className={`absolute z-30 p-2 bg-gray-200 hover:bg-gray-300 rounded-full ${isRtl ? 'left-0' : 'right-0'}`}
                >
                    {isRtl ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
                </button>
            </div>

            {/* Modal Preview */}
            <AnimatePresence>
                {modalImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[999] bg-black bg-opacity-80 flex items-center justify-center"
                        onClick={() => setModalImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full max-w-4xl h-[80vh]"
                            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                        >
                            <Image
                                src={modalImage}
                                alt={t('image_alt_modal')}
                                fill
                                className="object-contain rounded-xl"
                                sizes="100vw"
                            />
                            <button
                                onClick={() => setModalImage(null)}
                                className="absolute top-4 right-4 text-white text-3xl font-bold"
                            >
                                &times;
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GallerySlider;
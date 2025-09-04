'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
    { src: '/gallery/gallery1.jpg', alt: 'Project 1' },
    { src: '/gallery/gallery2.jpg', alt: 'Project 2' },
    { src: '/gallery/gallery3.jpg', alt: 'Project 3' },
    { src: '/gallery/gallery4.jpg', alt: 'Project 4' },
    { src: '/gallery/gallery5.jpg', alt: 'Project 5' },
];

const GallerySlider = () => {
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [modalImage, setModalImage] = useState<string | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const handlePrev = () => {
        setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    useEffect(() => {
        if (!isPaused) {
            intervalRef.current = setInterval(() => {
                setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
            }, 3000);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPaused]);

    return (
        <div
            className="max-w-6xl mx-auto py-12 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Heading */}
            <motion.h2
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold text-center mb-8"
            >
                Our Projects Gallery
            </motion.h2>

            {/* Slider with arrows insides */}
            <div className="relative flex items-center justify-center">
                {/* Left Arrow */}
                <button
                    onClick={handlePrev}
                    className="absolute left-0 z-30 p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
                >
                    <ChevronLeft size={24} />
                </button>

                {/* Image Slider */}
                <div className="flex items-center justify-center gap-4 overflow-hidden">
                    {images.map((img, index) => {
                        const isCenter = index === current;
                        const isLeft = index === (current === 0 ? images.length - 1 : current - 1);
                        const isRight = index === (current === images.length - 1 ? 0 : current + 1);

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
                                onClick={() => setModalImage(img.src)}
                            >
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    fill
                                    className="object-cover"
                                    sizes="256px"
                                />
                            </motion.div>
                        );
                    })}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={handleNext}
                    className="absolute right-0 z-30 p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
                >
                    <ChevronRight size={24} />
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
                            onClick={(e:React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                        >
                            <Image
                                src={modalImage}
                                alt="Preview"
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
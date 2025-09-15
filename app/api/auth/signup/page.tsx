'use client';
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import * as motion from "motion/react-client";
import logo from "@/public/elqasr-logo.png";
import { EyeOff, Eye } from 'lucide-react';
import Image from "next/image";
import { signup } from "@/server/Users";
import Head from "next/head";

export default function SignUpPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [success, setSuccess] = useState<string | null>(null);

    const slideInLeft = {
        initial: { opacity: 0, x: -60 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.7, ease: "easeOut" }
    };

    const mutation = useMutation({
        mutationFn: signup,
        onSuccess: (data) => {
            if (data.success) {
                signIn('credentials', { email, password, callbackUrl: '/' });
            } else {
                setError(data.message || "Failed to sign up");
            }
        },
        onError: (err:Error) => {
            setError(err?.message || "Something went wrong");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ name, email, password });
    };

    return (
        <main className="flex-grow flex min-h-screen">
            <Head>
                <title>El Qasr Development | signup</title>
                <meta
                    name="description"
                    content="El Qasr Development provides premium residential and commercial projects in Egypt."
                />
                <meta name="robots" content="index, follow" />
            </Head>
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 w-full"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={slideInLeft}
            >
                {/* Left side - Image */}
                <div className="hidden md:flex items-center justify-center bg-gray-200 p-4">
                    <Image
                        src={logo}
                        alt="Admin Logo"
                        className="w-full max-w-lg h-auto object-contain"
                    />
                </div>

                {/* Right side - Form */}
                <div className="flex items-center justify-center bg-gray-700 px-4 sm:px-6 lg:px-8 py-12">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-md p-6 sm:p-8 bg-white rounded-2xl shadow-lg"
                    >
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
                            Sign Up As Admin
                        </h2>

                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4 text-gray-700"
                            required
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4 text-gray-700"
                            required
                        />

                        <div className="relative mb-6">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none pr-12 text-gray-700"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-800"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
                        {success && <p className="text-green-600 mb-4 text-center">{success}</p>}

                        <button
                            type="submit"
                            className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-lg sm:text-base"
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
            </motion.div>
        </main>
    );
}

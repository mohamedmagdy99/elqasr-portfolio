'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import * as motion from "motion/react-client";
import logo from "@/public/elqasr-logo.png";
import { EyeOff,Eye  } from 'lucide-react';
import Image from "next/image";

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const slideInLeft = {
        initial: { opacity: 0, x: -60 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.7, ease: "easeOut" }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await signIn('credentials', {
            email,
            password,
            callbackUrl: 'http://localhost:3001/',
        });
    };

    return (
        <main className="flex-grow flex">
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 w-full"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={slideInLeft}
            >
                {/* Left side - Image */}
                <div className="hidden md:flex items-center justify-center bg-gray-200">
                    <Image
                        src={logo}
                        alt="Admin Login"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Right side - Form */}
                <div className="flex items-center justify-center bg-gray-700 px-6">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg"
                    >
                        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                            Sign In As Admin
                        </h2>

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
                        />

                        <div className="relative mb-6">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none pr-12"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-800"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4 text-gray-700"/> : <Eye className="w-4 h-4 text-gray-700"/>}
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </motion.div>
        </main>
    );
}
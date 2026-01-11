// components/PagesHero/PagesHero.tsx
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from "next/image";
import logo from "@/public/elqasr-logo.png";
import { useLocale } from 'next-intl';

interface Props {
    title: string,
    description: string,
}

const PagesHero = ({ title, description }: Props) => {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const vs = `
      attribute vec2 a_position;
      attribute float a_size;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        gl_PointSize = a_size;
      }
    `;

    const fs = `
      precision mediump float;
      uniform vec4 u_color;
      void main() {
        float d = distance(gl_PointCoord, vec2(0.5));
        if (d > 0.5) discard;
        gl_FragColor = u_color;
      }
    `;

    const createShader = (
      gl: WebGLRenderingContext,
      type: number,
      source: string
    ): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram();
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vs);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fs);
    if (!vertexShader || !fragmentShader || !program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const particleCount = 80;
    const particles = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 2);

    for (let i = 0; i < particleCount; i++) {
      particles[i * 3] = Math.random() * 2 - 1;
      particles[i * 3 + 1] = Math.random() * 2 - 1;
      particles[i * 3 + 2] = Math.random() * 2.5 + 1.0;
      velocities[i * 2] = (Math.random() - 0.5) * 0.0015;
      velocities[i * 2 + 1] = (Math.random() - 0.5) * 0.0015;
    }

    const buffer = gl.createBuffer();
    if (!buffer) return;
    const posLoc = gl.getAttribLocation(program, "a_position");
    const sizeLoc = gl.getAttribLocation(program, "a_size");
    const colLoc = gl.getUniformLocation(program, "u_color");
    if (colLoc === null) return;

    let animationFrame: number;
    const render = (
      particles: Float32Array | null,
      velocities: Float32Array | null
    ) => {
      if (!canvas || !gl || !particles || !velocities) return;
      // Set canvas internal resolution to match display size
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      for (let i = 0; i < particleCount; i++) {
        const pIdx = i * 3;
        const vIdx = i * 2;

        particles[pIdx]! += velocities[vIdx]!;
        particles[pIdx + 1]! += velocities[vIdx + 1]!;

        if (Math.abs(particles[pIdx]!) > 1.1) velocities[vIdx]! *= -1;
        if (Math.abs(particles[pIdx + 1]!) > 1.1) velocities[vIdx + 1]! *= -1;
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, particles, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 12, 0);
      gl.enableVertexAttribArray(sizeLoc);
      gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, 12, 8);

      // Subtle gold/blue particles
      gl.uniform4f(colLoc, 0.7, 0.5, 0.2, 0.4);
      gl.drawArrays(gl.POINTS, 0, particleCount);

      animationFrame = requestAnimationFrame(() =>
        render(particles, velocities)
      );
    };

    render(particles, velocities);
    return () => cancelAnimationFrame(animationFrame);
  }, []);
  return (
    <div
      className="relative w-full overflow-hidden bg-[#02040a] py-40 md:py-64 min-h-screen flex items-center justify-center selection:bg-amber-500/30"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,transparent_0%,#02040a_90%)]" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#02040a] via-transparent to-[#02040a]" />

      <div className="relative z-10 max-w-5xl px-6 mx-auto text-center">
        <motion.div
          initial="initial"
          animate="animate"
          className="flex flex-col items-center"
        >
          <motion.div variants={fadeInUp} className="mb-12 relative group">
            <div className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-full scale-150 group-hover:bg-amber-500/20 transition-colors duration-700" />
            <div className="w-20 h-20 md:w-24 md:h-24 relative flex items-center justify-center">
              <svg
                viewBox="0 0 100 100"
                className="text-amber-500 w-full h-full drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]"
              >
                <path
                  d="M50 10 L85 35 V80 H15 V35 L50 10Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M50 10 L38 28 H62 L50 10Z" fill="currentColor" />
                <rect
                  x="44"
                  y="55"
                  width="12"
                  height="25"
                  fill="currentColor"
                  opacity="0.8"
                />
                <circle cx="50" cy="40" r="3" fill="currentColor" />
              </svg>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="overflow-hidden mb-4">
            <span className="text-[10px] md:text-xs uppercase tracking-[0.6em] text-amber-500/60 font-semibold inline-block">
              {isRtl
                ? "تجسيد الفخامة المعمارية"
                : "Defining Architectural Luxury"}
            </span>
          </motion.div>

          {/* Gold Gradient Title */}
          <div className="relative overflow-hidden mb-8">
            <motion.h1
              variants={fadeInUp}
              className="text-6xl md:text-9xl font-serif tracking-tight leading-[1.1] pb-2 bg-clip-text text-transparent bg-gradient-to-b from-[#fef3c7] via-[#d97706] to-[#78350f] animate-text-shimmer"
              style={{
                fontFamily: "Playfair Display, serif, system-ui",
                backgroundImage:
                  "linear-gradient(to bottom, #FDE68A 0%, #D97706 45%, #B45309 55%, #78350F 100%)",
                backgroundSize: "100% 200%",
              }}
            >
              {title || (isRtl ? "مشاريعنا الرائدة" : "Iconic Landmarks")}
            </motion.h1>
            {/* Reflective Shine Overlay */}
            <div className="absolute inset-0 pointer-events-none mix-blend-overlay">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_4s_infinite]" />
            </div>
          </div>

          <motion.div
            variants={fadeInUp}
            className="flex items-center gap-4 mb-10 opacity-50"
          >
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-500" />
            <div className="w-1.5 h-1.5 rotate-45 border border-amber-500" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-500" />
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light tracking-wide italic"
          >
            {description ||
              (isRtl
                ? "حيث تلتقي الرؤية مع الإتقان في عالم العقارات الفاخرة."
                : "Where vision meets artisanal craftsmanship in the realm of luxury real estate.")}
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mt-16 animate-bounce opacity-20"
          >
            <div className="w-px h-12 bg-gradient-to-b from-amber-500 to-transparent mx-auto" />
          </motion.div>
        </motion.div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-20deg); }
          25%, 100% { transform: translateX(200%) skewX(-20deg); }
        }
      `,
        }}
      />
    </div>
  );
};
export default PagesHero;
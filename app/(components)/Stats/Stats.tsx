"use client";

import * as motion from "motion/react-client";
import AnimatedCounter from "@components/AnimatedCounter/AnimatedCounter";
import { useTranslations } from "next-intl";

const container = {
  animate: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.2,
    },
  },
};

const card = {
  initial: {
    opacity: 0,
    y: 80,
    scale: 0.75,
    rotateX: -25,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.9,
    },
  },
};

const float = {
  animate: {
    y: [0, -12, 0],
  },
};

const Stats = () => {
  const t = useTranslations("Stats");

  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-br from-[#eeeff0]  to-white">
      {/* 🌈 INTENSE animated blobs */}
      {/* <motion.div
        className="absolute -top-48 -left-48 w-[700px] h-[700px] bg-blue-500/40 rounded-full blur-[160px]"
        animate={{ x: [0, 120, 0], y: [0, 100, 0] }}
        transition={{ duration: 30, repeat: Infinity }}
      />
 */}
      {/* <motion.div
        className="absolute top-1/2 -right-48 w-[700px] h-[700px] bg-purple-500/40 rounded-full blur-[160px]"
        animate={{ x: [0, -120, 0], y: [0, -100, 0] }}
        transition={{ duration: 34, repeat: Infinity }}
      /> */}

      {/* 🧊 STATS */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-10 perspective-[1200px]"
          variants={container}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {[
            { value: 50, label: t("projects") },
            { value: 5, label: t("experience") },
            { value: 95, label: t("satisfaction") },
            { value: 20, label: t("team") },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={card}
              whileHover={{
                y: -16,
                scale: 1.05,
                rotateX: 8,
                //boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
              }}
              animate={float}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                repeatType: "mirror",
              }}
              className="
                relative
                border border-white/20
                rounded-3xl p-10
                text-center
                shadow-2xl
                text-gray-900
              "
            >
              {/* Glow */}
              {/* <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent opacity-0 hover:opacity-100 transition pointer-events-none" /> */}

              <AnimatedCounter target={stat.value} duration={3} />
              <div className="mt-3 font-semibold tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;

import * as motion from "motion/react-client";
import AnimatedCounter from "@components/AnimatedCounter/AnimatedCounter"
const Stats = () => {
    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };
    const scaleIn = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5, ease: "easeOut" }
    };
    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg-px-8">
            <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-8"
                variants={staggerContainer}
            >
                <motion.div className="text-center" variants={scaleIn}>
                    <AnimatedCounter target={50} duration={1.5} />
                    <div className="text-gray-600 font-bold">Projects Completed</div>
                </motion.div>

                <motion.div className="text-center" variants={scaleIn}>
                    <AnimatedCounter target={5} duration={1.2} />
                    <div className="text-gray-600 font-bold">Years Experience</div>
                </motion.div>

                <motion.div className="text-center" variants={scaleIn}>
                    <AnimatedCounter target={95} duration={1.8} />
                    <div className="text-gray-600 font-bold">Client Satisfaction</div>
                </motion.div>

                <motion.div className="text-center" variants={scaleIn}>
                    <AnimatedCounter target={20} duration={1.4} />
                    <div className="text-gray-600 font-bold">Expert Team</div>
                </motion.div>
            </motion.div>
        </div>
    )
}
export default Stats

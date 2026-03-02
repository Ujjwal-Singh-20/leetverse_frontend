import { motion } from 'framer-motion';

const Hero = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
    };

    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 px-4 overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 text-center"
            >
                <motion.div variants={itemVariants} className="inline-block mb-4 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                    <span className="text-accent text-xs font-mono tracking-widest uppercase">E-Labs Presents</span>
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    className="text-7xl md:text-9xl font-bold mb-6 tracking-tighter"
                >
                    LEET<span className="text-accent neon-text">VERSE</span>
                </motion.h1>

                <motion.div variants={itemVariants} className="mb-10 max-w-2xl mx-auto">
                    <p className="text-2xl md:text-3xl text-text-secondary font-mono terminal-text">
                        Compete. Learn. Dominate.
                    </p>
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={() => document.getElementById('leaderboard').scrollIntoView({ behavior: 'smooth' })}
                        className="group relative px-8 py-4 bg-accent text-background font-bold text-lg overflow-hidden transition-all hover:pr-12 shadow-[0_0_20px_rgba(0,255,157,0.3)]"
                    >
                        <span className="relative z-10">VIEW LEADERBOARD</span>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">→</span>
                    </button>

                    <button className="px-8 py-4 border border-text-dim text-text-primary font-bold text-lg hover:border-accent hover:text-accent transition-colors">
                        ABOUT E-LABS
                    </button>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] uppercase tracking-[0.3em] text-text-dim font-mono">Scroll Down</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-accent to-transparent" />
            </motion.div>
        </section>
    );
};

export default Hero;

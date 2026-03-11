import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, Zap } from 'lucide-react';

const ELabsModal = ({ onClose }) => (
    <AnimatePresence>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 backdrop-blur-md bg-black/70"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.93, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.93, y: 20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-2xl bg-[#0a0a0a] border border-[#f97316]/30 shadow-[0_0_60px_rgba(249,115,22,0.15)] overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Orange top bar */}
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#f97316] to-transparent" />

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#f97316]/60" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#f97316]/60" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#f97316]/60" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#f97316]/60" />

                {/* Glow blob */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#f97316]/8 blur-[60px] pointer-events-none" />

                <div className="p-8 md:p-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#f97316] animate-pulse" />
                                <span className="text-[10px] font-mono text-[#f97316]/70 uppercase tracking-[0.3em] font-bold">Community Platform</span>
                            </div>
                            <h2 className="text-4xl font-black tracking-tighter text-white">
                                E<span className="text-[#f97316]">Labs</span>
                            </h2>
                            <div className="mt-1 h-[1px] w-16 bg-gradient-to-r from-[#f97316]/60 to-transparent" />
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-white/30 hover:text-[#f97316] hover:bg-[#f97316]/10 rounded-sm transition-all border border-transparent hover:border-[#f97316]/20"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-6">
                        <Zap size={14} className="text-[#f97316] shrink-0" />
                        <div className="h-[1px] flex-1 bg-white/5" />
                    </div>

                    {/* Body */}
                    <p className="text-white/70 leading-relaxed text-sm md:text-base font-light tracking-wide">
                        E-Labs is a student-run peer-to-peer technical engagement platform designed to empower learners. We go beyond the confines of traditional academic curricula, offering a diverse range of courses and projects that cater to your unique interests and professional aspirations.
                    </p>
                    <p className="mt-4 text-white/70 leading-relaxed text-sm md:text-base font-light tracking-wide">
                        Our platform provides a dynamic and collaborative learning environment where you can connect with fellow students, share knowledge, and work together on challenging projects. By actively engaging with your peers, you gain valuable real-world experience, develop essential soft skills, and bridge the critical gap between theoretical knowledge and the ever-evolving demands of the professional world.
                    </p>
                    <p className="mt-4 text-white/70 leading-relaxed text-sm md:text-base font-light tracking-wide">
                        At E-Labs, we believe in the power of collaborative learning and mentorship to foster innovation, creativity, and personal growth. Join us on this exciting journey of discovery and unlock your full potential.
                    </p>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-4">
                        <div className="flex-1 h-[1px] bg-gradient-to-r from-[#f97316]/20 to-transparent" />
                        <span className="text-[10px] font-mono text-[#f97316]/40 uppercase tracking-[0.3em]">KIIT University</span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    </AnimatePresence>
);

const Hero = () => {
    const [showModal, setShowModal] = useState(false);

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
        <>
            {showModal && <ELabsModal onClose={() => setShowModal(false)} />}
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
                        <span className="text-accent text-xs font-mono tracking-widest uppercase">ELabs Presents</span>
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-7xl md:text-9xl font-bold mb-6 tracking-tighter"
                    >
                        LEET<span className="text-accent neon-text">VERSE</span>
                    </motion.h1>

                    <motion.div variants={itemVariants} className="mb-10 max-w-2xl mx-auto">
                        <p className="text-2xl md:text-3xl text-text-secondary font-mono terminal-text uppercase tracking-widest">
                            CODING. DSA. CONTEST.
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

                        <button
                            onClick={() => setShowModal(true)}
                            className="group px-8 py-4 border border-[#f97316]/40 text-white font-bold text-lg hover:border-[#f97316] hover:text-[#f97316] hover:shadow-[0_0_20px_rgba(249,115,22,0.2)] transition-all duration-300"
                        >
                            ABOUT E<span className="text-[#f97316]">LABS</span>
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
                    {/* <span className="text-[10px] uppercase tracking-[0.3em] text-text-dim font-mono">Scroll Down</span> */}
                    <div className="w-[1px] h-12 bg-gradient-to-b from-accent to-transparent" />
                </motion.div>
            </section>
        </>
    );
};

export default Hero;


import { motion } from 'framer-motion';
import { Youtube, Linkedin, Instagram, Github, ArrowUpRight } from 'lucide-react';

const Connect = () => {
    const socialLinks = [
        { name: 'LinkedIn', icon: <Linkedin />, url: 'https://www.linkedin.com/company/leetverse/' },
        { name: 'YouTube', icon: <Youtube />, url: 'https://www.youtube.com/@Leetverse' },
        { name: 'Instagram', icon: <Instagram />, url: 'https://www.instagram.com/leetverse/' },
    ];

    return (
        <footer className="py-24 px-4 border-t border-white/5 relative overflow-hidden">
            {/* Background Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black text-white/[0.02] whitespace-nowrap pointer-events-none uppercase tracking-tighter select-none">
                LEETVERSE
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">CONNECT WITH <span className="text-accent">US</span></h2>
                        <p className="text-text-secondary text-lg mb-8 max-w-md">
                            Join our community of passionate developers and problem solvers. Stay updated with our latest sessions.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            {socialLinks.map((link) => (
                                <motion.a
                                    key={link.name}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -5 }}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-accent/40 hover:text-accent transition-all group"
                                >
                                    {link.icon}
                                    <span className="font-mono text-xs uppercase tracking-widest">{link.name}</span>
                                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="p-8 bg-accent/5 border border-accent/10">
                            <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-4">Community Info</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-dim">Focus:</span>
                                    <span className="text-text-primary font-mono">Skill Development</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    {/* <span className="text-text-dim">Environment:</span>
                                    <span className="text-text-primary font-mono">Collaborative</span> */}
                                    <span className="text-text-dim">Status:</span>
                                    <span className="text-text-primary font-mono">Growing Daily</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-dim">Current Event:</span>
                                    <span className="text-accent font-mono animate-pulse">LEETVERSE SEASON 1</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-text-dim text-xs font-mono">
                            &copy; {new Date().getFullYear()} LEETVERSE. ALL RIGHTS RESERVED.
                            <br />
                            DESIGNED FOR THE ELITE.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Connect;


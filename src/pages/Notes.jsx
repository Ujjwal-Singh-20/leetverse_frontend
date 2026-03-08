import React from 'react';
import { Folder, Github, ExternalLink, BookOpen, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ResourceCard = ({ title, description, url, icon: Icon, type }) => (
    <motion.a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="relative group p-8 bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-accent/40 transition-all flex flex-col h-full"
    >
        {/* Decorative Background Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[60px] group-hover:bg-accent/10 transition-colors" />

        <div className="flex justify-between items-start mb-8">
            <div className="p-4 bg-accent/10 rounded-2xl border border-accent/20 group-hover:border-accent/40 transition-colors">
                <Icon className="text-accent" size={32} />
            </div>
            <ExternalLink className="text-white/20 group-hover:text-accent transition-all" size={20} />
        </div>

        <div className="mt-auto">
            <p className="text-accent font-mono text-xs tracking-[0.3em] uppercase mb-3">{type}</p>
            <h3 className="text-3xl font-display font-bold text-white mb-4 tracking-tight group-hover:text-accent transition-colors">
                {title}
            </h3>
            <p className="text-white/40 text-sm leading-relaxed mb-6 group-hover:text-white/60 transition-colors">
                {description}
            </p>

            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-accent group-hover:gap-4 transition-all">
                Access Resource
                <div className="h-[1px] w-8 bg-accent/30 group-hover:w-12 transition-all" />
            </div>
        </div>
    </motion.a>
);

const Notes = () => {
    const resources = [
        {
            title: "Google Drive",
            description: "A collection of study materials and lecture notes to help with your preparation.",
            url: "https://drive.google.com/drive/folders/1Mc7DsH2oyeQQIGhoODpaQx5tQKk3MDNl",
            icon: Folder,
            type: "Storage"
        },
        {
            title: "GitHub",
            description: "This is the official GitHub repository for the LeetVerse bootcamp. Access all the code covered in class here.",
            url: "https://github.com/Chetan-Kedia/LeetVerse",
            icon: Github,
            type: "Repository"
        }
    ];

    return (
        <div className="min-h-screen pt-32 pb-40 px-6 relative overflow-hidden">
            {/* Background Decorative Pulses */}
            <div className="absolute top-1/4 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-[160px] animate-pulse" />
            <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-accent/[0.03] rounded-full blur-[160px] animate-pulse delay-1000" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-24"
                >
                    <div className="inline-flex items-center gap-3 px-4 py-2 border border-white/10 bg-white/5 rounded-full mb-8">
                        <BookOpen size={16} className="text-white/40" />
                        <span className="text-white/40 font-mono text-[10px] uppercase tracking-[0.3em] font-bold">Resources</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-bold tracking-tighter mb-8 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent uppercase">
                        Notes
                    </h1>

                    <p className="text-white/40 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
                        Find all our shared study materials and code repositories in one place.
                    </p>
                </motion.div>

                {/* Resources Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {resources.map((res, i) => (
                        <ResourceCard key={i} {...res} />
                    ))}
                </div>

                {/* Footer decoration */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-40 text-center"
                >
                    <div className="h-[1px] w-24 bg-white/5 mx-auto mb-10" />
                    <div className="flex flex-col items-center gap-6">
                        <p className="text-white/10 font-mono text-[10px] uppercase tracking-[0.6em]">
                            Resources Synced
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Notes;

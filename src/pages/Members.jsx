import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Users, Crown, Star, Instagram, Linkedin, Github, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MemberCard = ({ person, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-accent/30 transition-all group/card flex flex-col items-center text-center"
    >
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-accent/20 group-hover/card:border-accent transition-all mb-6 relative">
            <img
                src={person.photoUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder"}
                alt={person.name}
                className="w-full h-full object-cover grayscale group-hover/card:grayscale-0 transition-all duration-500"
            />
        </div>
        <h4 className="text-xl font-display font-bold text-white mb-2 tracking-tight">{person.name}</h4>

        <div className="flex items-center gap-4 mt-4">
            {person.instagram && (
                <a href={person.instagram} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-accent transition-colors">
                    <Instagram size={18} />
                </a>
            )}
            {person.linkedin && (
                <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-accent transition-colors">
                    <Linkedin size={18} />
                </a>
            )}
            {person.github && (
                <a href={person.github} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-accent transition-colors">
                    <Github size={18} />
                </a>
            )}
        </div>
    </motion.div>
);

const Members = () => {
    const [members, setMembers] = useState({ president: [], 'vice-president': [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                console.log("Fetching members from Firestore...");
                const roles = ['president', 'vice-president'];
                const fetchedData = {};

                for (const role of roles) {
                    const personsRef = collection(db, 'members', role, 'persons');
                    const snapshot = await getDocs(personsRef);
                    fetchedData[role] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    console.log(`Fetched ${fetchedData[role].length} persons for ${role}`);
                }

                setMembers(fetchedData);
            } catch (err) {
                console.error("Error fetching members:", err);
                setError("Unable to sync with database. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <Loader2 className="text-accent animate-spin" size={48} />
                    <p className="text-accent/40 font-mono text-xs uppercase tracking-widest">Loading...</p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-6">
                <div className="text-center p-8 border border-red-500/20 bg-red-500/5 rounded-2xl max-w-md">
                    <AlertCircle className="text-red-400 mx-auto mb-4" size={48} />
                    <h3 className="text-white font-display text-xl mb-2">Sync Error</h3>
                    <p className="text-white/40 text-sm mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all rounded-lg font-mono text-xs uppercase"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-40 px-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-[160px] animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/[0.03] rounded-full blur-[160px] animate-pulse delay-700" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="text-center mb-24"
                >
                    <h2 className="text-accent font-mono text-sm tracking-[0.5em] uppercase mb-4">Core Team</h2>
                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                        MEMBERS
                    </h1>
                    <div className="h-1 w-24 bg-accent mx-auto mb-8" />
                    <p className="text-white/60 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                        Setting things up. Our team structure is being refined and members will be listed here soon.
                    </p>
                </motion.div>

                {/* President Section */}
                <section className="mb-24">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <h3 className="flex items-center gap-3 text-accent font-mono text-sm tracking-[0.3em] uppercase">
                            <Crown size={20} className="text-accent" /> President
                        </h3>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>

                    {members.president.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {members.president.map((person, i) => (
                                <MemberCard key={person.id} person={person} index={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-12 border border-white/5 bg-white/[0.02] rounded-3xl">
                            <p className="text-white/20 font-mono text-xs uppercase tracking-widest">Roster currently empty</p>
                        </div>
                    )}
                </section>

                {/* Vice President Section */}
                <section className="mb-32">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <h3 className="flex items-center gap-3 text-accent font-mono text-sm tracking-[0.3em] uppercase">
                            <Star size={20} className="text-accent" /> Vice President
                        </h3>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>

                    {members['vice-president'].length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {members['vice-president'].map((person, i) => (
                                <MemberCard key={person.id} person={person} index={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-12 border border-white/5 bg-white/[0.02] rounded-3xl">
                            <p className="text-white/20 font-mono text-xs uppercase tracking-widest">Roster currently empty</p>
                        </div>
                    )}
                </section>

                {/* Coming Soon Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="relative mt-20 group"
                >
                    <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-transparent to-background z-20" />

                    <div className="relative z-10 opacity-5 blur-sm pointer-events-none grayscale overflow-hidden">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="aspect-square bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center p-6">
                                    <Users size={32} className="text-white/20 mb-4" />
                                    <div className="h-2 w-full bg-white/10 rounded" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <h2 className="text-5xl sm:text-7xl md:text-9xl font-display font-black tracking-tighter text-white/5 uppercase select-none">
                                Coming Soon
                            </h2>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="px-8 py-3 border border-accent/20 bg-background/80 backdrop-blur-md rounded-full shadow-2xl"
                                >
                                    <p className="text-accent font-mono text-sm tracking-[0.4em] uppercase font-bold">More roles pending</p>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Footer Note */}
                <div className="mt-40 text-center">
                    <p className="text-white/10 font-mono text-[10px] uppercase tracking-[0.6em]">
                        Synced
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Members;

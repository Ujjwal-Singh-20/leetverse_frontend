import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getAvailableSeasons } from '../services/api';

const Leaderboard = () => {
    const [availableSeasons, setAvailableSeasons] = useState([]);
    const [currentSession, setCurrentSession] = useState({
        season: import.meta.env.VITE_CURRENT_SEASON || 'Season_1',
        level: import.meta.env.VITE_CURRENT_LEVEL || 'Level_1'
    });

    useEffect(() => {
        const fetchAvailable = async () => {
            try {
                const res = await getAvailableSeasons();
                const seasons = res.data || [];
                setAvailableSeasons(seasons);
                
                const envSeason = import.meta.env.VITE_CURRENT_SEASON || 'season1';
                const envLevel = import.meta.env.VITE_CURRENT_LEVEL || 'level1';

                setCurrentSession({ season: envSeason, level: envLevel });
            } catch (err) {
                console.error("Failed to fetch sessions:", err);
            }
        };
        fetchAvailable();
    }, []);

    return (
        <section id="leaderboard" className="relative py-24 px-4 max-w-5xl mx-auto flex flex-col items-center">
            {/* Header (Minimal display for context) */}
            <div className="w-full flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div>
                    <h2 className="text-4xl sm:text-5xl font-black mb-4 font-display tracking-tighter text-white">
                        THE_<span className="text-accent underline decoration-accent/30 underline-offset-8">LEADERBOARD</span>
                    </h2>
                    <div className="flex flex-wrap items-center gap-4">
                        <p className="text-white/70 font-mono tracking-[0.3em] uppercase text-sm font-bold">
                            {currentSession.season} &bull; {currentSession.level} RANKINGS
                        </p>
                        {availableSeasons.length > 0 && (
                            <>
                                <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
                                <select 
                                    value={`${currentSession.season}:${currentSession.level}`}
                                    onChange={(e) => {
                                        const [s, l] = e.target.value.split(':');
                                        setCurrentSession({ season: s, level: l });
                                    }}
                                    className="bg-white/5 border border-white/10 text-accent font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-sm focus:outline-none focus:border-accent/40"
                                >
                                    {availableSeasons.map(s => s.levels.map(l => (
                                        <option key={`${s.season}:${l}`} value={`${s.season}:${l}`} className="bg-background text-white uppercase">
                                            {s.season} : {l}
                                        </option>
                                    )))}
                                </select>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Hype Section Placeholder / Landing State */}
            <div className="w-full py-12 flex justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-xl p-10 md:p-12 rounded-xl bg-black/60 border border-white/10 shadow-2xl flex flex-col items-center text-center"
                >
                    <h3 className="text-3xl md:text-4xl font-black font-display text-white tracking-tighter uppercase mb-4">
                        FINAL STANDINGS PENDING
                    </h3>
                    
                    <p className="text-xs md:text-sm font-mono text-accent uppercase tracking-[0.22em] mb-6">
                        [ Top Positions Hidden ]
                    </p>
                    
                    <p className="text-white/60 font-mono text-sm uppercase tracking-wide leading-relaxed mb-1">
                        The final rankings are being calculated.
                    </p>
                    <p className="text-white/60 font-mono text-sm uppercase tracking-wide leading-relaxed">
                        The podium will be revealed shortly.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default Leaderboard;

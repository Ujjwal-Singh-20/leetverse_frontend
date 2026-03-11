import { motion } from 'framer-motion';
import { Trophy, Medal, Star, RefreshCcw, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getTop10Leaderboard } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Leaderboard = () => {
    const { user } = useAuth();
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const response = await getTop10Leaderboard(user?.rollNo);
            setLeaderboardData(response.data);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            setLeaderboardData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.03 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    };

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1: return <Trophy className="text-yellow-400 w-8 h-8" />;
            case 2: return <Medal className="text-slate-300 w-8 h-8" />;
            case 3: return <Medal className="text-amber-600 w-8 h-8" />;
            default: return null;
        }
    };

    const getRankColor = (rank, isCurrentUser) => {
        if (isCurrentUser) return 'border-accent bg-accent/10 shadow-[0_0_20px_rgba(0,255,157,0.15)] ring-1 ring-accent/50';
        switch (rank) {
            case 1: return 'border-yellow-400/50 bg-yellow-400/10 shadow-[0_0_20px_rgba(250,204,21,0.1)]';
            case 2: return 'border-slate-300/50 bg-slate-400/10 shadow-[0_0_20px_rgba(203,213,225,0.1)]';
            case 3: return 'border-amber-600/50 bg-amber-600/10 shadow-[0_0_20px_rgba(217,119,6,0.1)]';
            default: return 'border-white/10 bg-white/5 hover:border-accent/40 hover:bg-accent/5';
        }
    };

    // Logic to show Top 10 + Current User
    const getDisplayData = () => {
        const top10 = leaderboardData.slice(0, 10);
        const currentUserIndex = leaderboardData.findIndex(s => s.rollNo === user?.rollNo);

        if (currentUserIndex === -1 || currentUserIndex < 10) {
            return top10;
        }

        return [
            ...top10,
            { type: 'ellipsis', rollNo: 'ellipsis' },
            leaderboardData[currentUserIndex]
        ];
    };

    const displayData = getDisplayData();

    return (
        <section id="leaderboard" className="py-24 px-4 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div>
                    <h2 className="text-5xl font-black mb-4 font-display tracking-tighter text-white">THE_<span className="text-accent underline decoration-accent/30 underline-offset-8">LEADERBOARD</span></h2>
                    <p className="text-white/70 font-mono tracking-[0.3em] uppercase text-sm font-bold">Season 1 &bull; RANKINGS</p>
                </div>
                <button
                    onClick={fetchLeaderboard}
                    className="flex items-center gap-2 font-mono text-xs text-accent hover:opacity-70 transition-all uppercase tracking-widest border border-accent/20 px-4 py-2 rounded-sm"
                >
                    <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} /> SYNC_REALTIME
                </button>
            </div>

            {loading && leaderboardData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
                    <p className="font-mono text-accent animate-pulse">ESTABLISHING_UPLINK...</p>
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="space-y-4"
                >
                    {/* Header */}
                    <div className="hidden sm:flex px-8 py-2 text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] font-bold">
                        <span className="w-20">Rank</span>
                        <span className="flex-1 px-4">Participant Detail</span>
                        <span className="w-32 text-right">Commit Pts</span>
                    </div>

                    {displayData.map((item, index) => {
                        if (item.type === 'ellipsis') {
                            return (
                                <div key="ellipsis" className="flex justify-center py-4">
                                    <div className="flex gap-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-1.5 h-1.5 bg-accent/20 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                                        ))}
                                    </div>
                                </div>
                            );
                        }

                        const rank = item.rank || index + 1;
                        const isCurrentUser = item.rollNo === user?.rollNo;

                        return (
                            <motion.div
                                key={item.rollNo}
                                variants={itemVariants}
                                className={`group relative flex items-center px-6 md:px-8 py-5 border transition-all duration-300 ${getRankColor(rank, isCurrentUser)}`}
                            >
                                {/* Rank Number */}
                                <div className="w-20 flex items-center gap-2">
                                    <span className={`text-2xl font-black font-mono drop-shadow-[0_0_10px_rgba(0,255,157,0.2)] ${rank <= 3 || isCurrentUser ? 'text-accent' : 'text-white/40 group-hover:text-accent transition-colors'}`}>
                                        {rank.toString().padStart(2, '0')}
                                    </span>
                                    {getRankIcon(rank)}
                                </div>

                                {/* Student Info */}
                                <div className="flex-1 px-4 overflow-hidden">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-black tracking-tighter transition-all duration-300 font-mono truncate text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.05)] uppercase">
                                                {item.rollNo}
                                            </h3>
                                            {isCurrentUser && (
                                                <span className="px-2 py-0.5 bg-accent text-background text-[10px] font-black uppercase tracking-tighter rounded-sm animate-pulse flex items-center gap-1">
                                                    <User size={10} /> YOU
                                                </span>
                                            )}
                                        </div>
                                        {item.name && (
                                            <p className="text-sm text-accent/90 font-black font-mono group-hover:translate-x-1 transition-transform duration-300 tracking-tight brightness-125 whitespace-nowrap">
                                                {item.name}
                                            </p>
                                        )}
                                        {item.remarks && (
                                            <p className="text-[10px] text-white/50 font-mono font-medium italic opacity-0 group-hover:opacity-100 transition-opacity translate-y-1 group-hover:translate-y-0 duration-300 hidden sm:block">
                                                {item.remarks}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Score */}
                                <div className="w-32 text-right">
                                    <div className="flex flex-col items-end">
                                        <span className={`text-2xl font-mono font-black ${isCurrentUser ? 'text-white' : 'text-accent'} drop-shadow-[0_0_10px_rgba(0,255,157,0.3)]`}>
                                            {item.points}
                                        </span>
                                        <span className="text-[10px] text-white/40 font-mono uppercase tracking-[0.1em] font-bold">TOTAL_PTS</span>
                                    </div>
                                </div>

                                {/* Hover Glow Edge/Indicator */}
                                <div className={`absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-300 ${isCurrentUser ? 'bg-white' : 'bg-accent opacity-0 group-hover:opacity-100'}`} />
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}
        </section>
    );
};

export default Leaderboard;

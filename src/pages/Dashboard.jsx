import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserHistory, getUserProfile, getMyProfile, getOverallLeaderboard } from '../services/api';
import { Trophy, Calendar, Award, User, Users, Eye, X, Shield, ChevronRight } from 'lucide-react';

const UserDetailModal = ({ user, onClose }) => {
    const [rank, setRank] = useState('--');
    const [loadingRank, setLoadingRank] = useState(false);
    const [history, setHistory] = useState([]);
    const [attendancePercent, setAttendancePercent] = useState(null);
    const [loadingHistory, setLoadingHistory] = useState(false);

    useEffect(() => {
        const fetchRank = async () => {
            if (!user) return;
            setLoadingRank(true);
            try {
                const response = await getOverallLeaderboard();
                const leaderboard = response.data;
                const userIndex = leaderboard.findIndex(s => s.rollNo === user.rollNo);
                if (userIndex !== -1) {
                    setRank((userIndex + 1).toString().padStart(2, '0'));
                } else {
                    setRank('NR'); // Not Ranked
                }
            } catch (error) {
                console.error('Error fetching rank for modal:', error);
                setRank('ERR');
            } finally {
                setLoadingRank(false);
            }
        };

        const fetchHistory = async () => {
            if (!user) return;
            setLoadingHistory(true);
            try {
                const response = await getUserHistory(user.rollNo);
                const historyData = response.data.history || [];
                setHistory(historyData);

                // Calculate percentage from history if backend value seems incorrect or as a fallback
                if (historyData.length > 0) {
                    const presentDays = historyData.filter(h => h.status === 'present').length;
                    const calculatedPercent = Math.round((presentDays / historyData.length) * 100);
                    setAttendancePercent(calculatedPercent);
                } else {
                    setAttendancePercent(response.data.attendancePercentage || 0);
                }
            } catch (error) {
                console.error('Error fetching history for modal:', error);
            } finally {
                setLoadingHistory(false);
            }
        };

        fetchRank();
        fetchHistory();
    }, [user]);

    if (!user) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-background/80">
            <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200 border-accent/20">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                >
                    <X size={24} />
                </button>

                <div className="p-8">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center border border-accent/20">
                            <span className="text-3xl font-bold text-accent">{user.name?.charAt(0)}</span>
                        </div>
                        <div>
                            <h3 className="text-3xl font-display font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{user.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-accent font-mono text-sm uppercase tracking-[0.2em] font-black">{user.rollNo}</span>
                                <span className="w-1 h-1 bg-white/40 rounded-full" />
                                <span className="text-white/70 font-mono text-xs italic tracking-tight">{user.email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-6 rounded-sm border border-white/10">
                                <span className="text-[10px] font-mono text-white/70 uppercase block mb-1 tracking-widest font-bold">Total Points</span>
                                <span className="text-3xl font-black text-accent drop-shadow-[0_0_10px_rgba(0,255,157,0.3)]">{user.totalPoints}</span>
                            </div>
                            <div className="bg-white/5 p-6 rounded-sm border border-white/10">
                                <span className="text-[10px] font-mono text-white/70 uppercase block mb-1 tracking-widest font-bold">Global Rank</span>
                                <span className={`text-3xl font-black ${rank !== '--' && rank !== 'NR' && rank !== 'ERR' ? 'text-accent' : 'text-white'}`}>
                                    {loadingRank ? (
                                        <span className="inline-block w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin align-middle" />
                                    ) : rank}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white/5 p-6 rounded-sm border border-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Attendance Summary</span>
                                <div className="px-2 py-1 bg-accent/10 border border-accent/20 rounded-[2px]">
                                    <span className="text-[10px] font-mono text-accent">ACTIVE_SESSION</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="flex flex-col">
                                    <span className="text-xs font-mono text-white/70 mb-1 italic font-bold">Days Present</span>
                                    <span className="text-2xl font-black text-accent">{user.attendanceSummary?.daysPresent || 0}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-mono text-white/70 mb-1 italic font-bold">Attendance Rate</span>
                                    <span className="text-2xl font-black text-white">
                                        {attendancePercent !== null ? `${attendancePercent}%` : '--'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 p-6 rounded-sm border border-white/5">
                            <span className="text-[10px] font-mono text-white/40 uppercase block mb-3 tracking-widest">Score History</span>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left font-mono text-[11px]">
                                    <thead className="border-b border-white/5 bg-black/20">
                                        <tr>
                                            <th className="px-4 py-3 text-white/40 uppercase tracking-widest">Date</th>
                                            <th className="px-4 py-3 text-white/40 uppercase tracking-widest">Points</th>
                                            <th className="px-4 py-3 text-white/40 uppercase tracking-widest">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {loadingHistory ? (
                                            <tr>
                                                <td colSpan="3" className="px-4 py-8 text-center">
                                                    <div className="inline-block w-6 h-6 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                                                </td>
                                            </tr>
                                        ) : history.length > 0 ? (
                                            history.map((entry, idx) => (
                                                <tr key={idx} className="hover:bg-white/5 transition-colors">
                                                    <td className="px-4 py-3 text-white">{entry.date}</td>
                                                    <td className="px-4 py-3 text-accent">+{entry.points}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-1.5 py-0.5 rounded-sm border uppercase text-[9px] font-bold ${entry.status === 'present'
                                                            ? 'text-accent border-accent/20 bg-accent/5'
                                                            : 'text-red-400 border-red-500/20 bg-red-500/5'
                                                            }`}>
                                                            {entry.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="px-4 py-8 text-center text-white/20 italic">No history found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-white/5 p-6 rounded-sm border border-white/5">
                            <span className="text-[10px] font-mono text-white/40 uppercase block mb-3 tracking-widest">System Metadata</span>
                            <div className="bg-black/40 rounded-sm p-4 border border-white/5">
                                <pre className="text-[11px] font-mono text-accent/80 overflow-x-auto">
                                    {JSON.stringify(user, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [allAdmins, setAllAdmins] = useState([]);
    const [activeTab, setActiveTab] = useState('participants'); // 'participants' or 'admins'
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isAdmin) {
                    // Admin fetches all users and admins to manage
                    const response = await getUserProfile();
                    setAllUsers(response.data.participants || []);
                    setAllAdmins(response.data.admins || []);
                    setProfile({ role: 'admin' });
                } else if (user?.rollNo) {
                    // Participant view
                    const [profileRes, historyRes] = await Promise.all([
                        getUserProfile(),
                        getUserHistory(user.rollNo)
                    ]);
                    // getUserProfile returns { role, requesting_user, data:FirestoreDoc }
                    setProfile(profileRes.data.data || profileRes.data);
                    setHistory(historyRes.data.history || []);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchData();
        }
    }, [user, isAdmin, authLoading]);

    if (loading || authLoading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <div className="w-16 h-1 w-32 bg-accent/20 relative overflow-hidden mb-4">
                <div className="absolute top-0 left-0 h-full bg-accent animate-progress w-full" />
            </div>
            <p className="text-accent font-mono text-sm tracking-[0.5em] animate-pulse">SYNCHRONIZING_CORE_DATA...</p>
        </div>
    );

    // Admin View
    if (isAdmin) {
        return (
            <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="text-accent" size={18} />
                        <span className="text-accent font-mono text-xs font-bold tracking-[0.3em] uppercase">Security Level: Admin</span>
                    </div>
                    <h1 className="text-5xl font-display font-bold tracking-tighter mb-4 text-white uppercase">COMMAND_CENTRE</h1>
                    <p className="text-white/40 font-mono text-sm tracking-tight max-w-2xl">
                        Overview of all active participants and their historical performance data. Detailed profiles are accessible via the secure viewer.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
                    <div className="glass-panel p-8 flex flex-col justify-center border-accent/20">
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Total Participants</span>
                        <span className="text-4xl font-bold text-accent">{allUsers.length}</span>
                    </div>
                    <div className="lg:col-span-3 glass-panel p-8 flex flex-col justify-center border-white/5">
                        <div className="flex items-center gap-8 overflow-x-auto py-2">
                            <div className="flex flex-col shrink-0">
                                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Avg. Points</span>
                                <span className="text-2xl font-bold text-white">
                                    {Math.round(allUsers.reduce((acc, u) => acc + (u.totalPoints || 0), 0) / (allUsers.length || 1))}
                                </span>
                            </div>
                            <div className="w-[1px] h-10 bg-white/5" />
                            <div className="flex flex-col shrink-0">
                                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Total Points</span>
                                <span className="text-2xl font-bold text-white">
                                    {allUsers.reduce((acc, u) => acc + (u.totalPoints || 0), 0)}
                                </span>
                            </div>
                            <div className="w-[1px] h-10 bg-white/5" />
                            <div className="flex flex-col shrink-0">
                                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Total Admins</span>
                                <span className="text-2xl font-bold text-white">
                                    {allAdmins.length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('participants')}
                        className={`px-8 py-3 font-mono text-xs tracking-widest border transition-all flex items-center gap-2 ${activeTab === 'participants' ? 'bg-accent text-background border-accent shadow-[0_0_20px_rgba(0,255,157,0.3)]' : 'bg-transparent text-white/60 border-white/10 hover:border-accent/40 hover:text-white'}`}
                    >
                        <Users size={14} /> PARTICIPANTS ({allUsers.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('admins')}
                        className={`px-8 py-3 font-mono text-xs tracking-widest border transition-all flex items-center gap-2 ${activeTab === 'admins' ? 'bg-accent text-background border-accent shadow-[0_0_20px_rgba(0,255,157,0.3)]' : 'bg-transparent text-white/60 border-white/10 hover:border-accent/40 hover:text-white'}`}
                    >
                        <Shield size={14} /> ADMINISTRATORS ({allAdmins.length})
                    </button>
                </div>

                <div className="glass-panel overflow-hidden border-white/5">
                    <div className="bg-white/5 px-8 py-4 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {activeTab === 'participants' ? <Users className="text-accent" size={18} /> : <Shield className="text-accent" size={18} />}
                            <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase">
                                {activeTab === 'participants' ? 'Participant Database' : 'System Administrators'}
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono text-sm">
                            <thead className="border-b border-white/5 bg-black/20">
                                {activeTab === 'participants' ? (
                                    <tr>
                                        <th className="px-8 py-6 text-[10px] text-white/40 uppercase tracking-widest">ID / Roll No</th>
                                        <th className="px-8 py-6 text-[10px] text-white/40 uppercase tracking-widest">Full Name</th>
                                        <th className="px-8 py-6 text-[10px] text-white/40 uppercase tracking-widest text-center">Score</th>
                                        <th className="px-8 py-6 text-[10px] text-white/40 uppercase tracking-widest">Attendance</th>
                                        <th className="px-8 py-6 text-right text-[10px] text-white/40 uppercase tracking-widest">Actions</th>
                                    </tr>
                                ) : (
                                    <tr>
                                        <th className="px-8 py-6 text-[10px] text-white/40 uppercase tracking-widest">Administrator Email</th>
                                        <th className="px-8 py-6 text-[10px] text-white/40 uppercase tracking-widest text-right">Status</th>
                                    </tr>
                                )}
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {activeTab === 'participants' ? (
                                    allUsers.map((u, idx) => (
                                        <tr key={idx} className="hover:bg-accent/5 transition-colors group">
                                            <td className="px-8 py-6 font-black text-white group-hover:text-accent transition-colors tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">{u.rollNo}</td>
                                            <td className="px-8 py-6 text-white font-bold tracking-tight">{u.name}</td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="bg-accent/10 border border-accent/20 px-4 py-1.5 text-accent font-bold rounded-sm shadow-[0_0_15px_rgba(0,255,157,0.1)]">
                                                    {u.totalPoints}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 font-mono text-xs">
                                                <span className="text-accent font-bold">{u.attendanceSummary?.daysPresent || 0}P</span>
                                                <span className="mx-2 text-white/20">|</span>
                                                <span className="text-red-400 font-bold">{u.attendanceSummary?.daysAbsent || 0}A</span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button
                                                    onClick={() => setSelectedUser(u)}
                                                    className="p-3 bg-white/5 hover:bg-accent text-white group-hover:text-background rounded-sm transition-all border border-white/10"
                                                    title="View Full Profile"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    allAdmins.map((adm, idx) => (
                                        <tr key={idx} className="hover:bg-accent/5 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-white group-hover:text-accent transition-colors tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                                                        {adm.name?.toUpperCase() || "SYSTEM_ADMIN"}
                                                    </span>
                                                    <span className="text-[10px] text-white/60 mt-1">{adm.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold rounded-sm uppercase tracking-widest shadow-[0_0_10px_rgba(0,255,157,0.1)]">
                                                    AUTHORIZED_ADMIN
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
            </div>
        );
    }

    // Participant View
    return (
        <div className="pt-24 pb-12 px-6 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="md:col-span-2 glass-panel p-6 sm:p-10 relative overflow-hidden group border-white/5">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                        <User size={160} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-8 sm:mb-10 text-center sm:text-left">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-accent/10 rounded-full flex items-center justify-center border border-accent/20 ring-4 ring-accent/5">
                                <span className="text-2xl sm:text-3xl font-black text-accent">{user?.name?.charAt(0)}</span>
                            </div>
                            <div>
                                <h1 className="text-4xl font-display font-bold tracking-tighter text-white">{user?.name}</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-accent font-mono text-sm uppercase tracking-widest">{user?.rollNo}</span>
                                    <span className="px-2 py-0.5 bg-accent/10 text-accent text-[10px] font-bold rounded-sm uppercase tracking-widest">Participant</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest mb-1 italic">Total Points</span>
                                <span className="text-4xl font-black text-accent drop-shadow-[0_0_15px_rgba(0,255,157,0.4)]">{profile?.totalPoints || 0}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest mb-1 italic">Days Present</span>
                                <span className="text-4xl font-black text-white">{profile?.attendanceSummary?.daysPresent || 0}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest mb-1 italic">Days Absent</span>
                                <span className="text-4xl font-black text-red-500/80">{profile?.attendanceSummary?.daysAbsent || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6 sm:p-10 flex flex-col items-center justify-center text-center border-white/5 relative group cursor-default">
                    <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Award className="text-accent mb-6 animate-pulse" size={56} />
                    <h3 className="font-display font-bold text-xl mb-2 text-white tracking-tight">ACHIEVEMENTS</h3>
                    <p className="text-white/30 text-xs font-mono uppercase tracking-[0.2em]">System Expansion Pending...</p>
                </div>
            </div>

            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-display font-bold text-white tracking-tighter flex items-center gap-4">
                    <Calendar className="text-accent" size={28} /> SCORE_HISTORY
                </h2>
                <div className="h-[1px] flex-1 mx-8 bg-gradient-to-r from-white/10 to-transparent hidden sm:block" />
            </div>

            <div className="glass-panel overflow-hidden border-white/5">
                <table className="w-full text-left font-mono text-sm">
                    <thead className="border-b border-white/5 bg-white/5">
                        <tr>
                            <th className="px-8 py-6 text-[10px] text-white/40 uppercase tracking-widest">Date / Index</th>
                            <th className="px-8 py-6 text-[10px] text-white/40 uppercase tracking-widest">Status Code</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {history.length > 0 ? (
                            history.map((entry, idx) => (
                                <tr key={idx} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-8 py-6 text-white group-hover:text-accent transition-colors">{entry.date}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-2 py-1 text-[10px] font-bold rounded-sm border uppercase ${entry.status === 'present'
                                            ? 'text-accent border-accent/20 bg-accent/5'
                                            : 'text-red-400 border-red-500/20 bg-red-500/5'
                                            }`}>
                                            {entry.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="px-8 py-20 text-center text-white/20 italic font-mono uppercase tracking-widest">
                                    No transaction history found for this identifier.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;

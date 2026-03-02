import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Unauthorized = () => {
    const navigate = useNavigate();
    const { logout, login, authError } = useAuth();

    const handleLogoutAndHome = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full cyber-grid opacity-10 pointer-events-none" />
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-lg w-full glass-panel p-12 text-center border-red-500/20 relative z-10">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20">
                    <ShieldAlert className="text-red-500" size={40} />
                </div>

                <h1 className="text-4xl font-display font-bold tracking-tighter mb-4 text-white">ACCESS_DENIED</h1>

                <p className="text-white/60 font-mono text-sm leading-relaxed mb-10">
                    {authError || "YOUR_EMAIL_ADDRESS_IS_NOT_AUTHORIZED_TO_ACCESS_THIS_SYSTEM."}
                    <br />
                    ONLY_OFFICIAL_<span className="text-red-400 font-bold">@KIIT.AC.IN</span>_EMAILS_ARE_ALLOWED.
                </p>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={login}
                        className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 font-display font-bold tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                        <LogIn size={18} /> TRY_ANOTHER_ACCOUNT
                    </button>

                    <button
                        onClick={handleLogoutAndHome}
                        className="w-full py-4 text-white/40 hover:text-white font-mono text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={14} /> BACK_TO_HOME
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;

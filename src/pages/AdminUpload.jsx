import React, { useState, useEffect } from 'react';
import { uploadExcel, getUploadStatus } from '../services/api';
import { Upload, FileSpreadsheet, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';

const AdminUpload = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success' | 'error'
    const [message, setMessage] = useState('');
    const [alreadyUploaded, setAlreadyUploaded] = useState(false);
    const [forceUpload, setForceUpload] = useState(false);

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await getUploadStatus(today);
            if (response.data.uploaded) {
                setAlreadyUploaded(true);
            }
        } catch (error) {
            console.error('Error checking upload status:', error);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setStatus(null);
        setMessage('');
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await uploadExcel(formData);
            setStatus('success');
            setAlreadyUploaded(true);
            setForceUpload(false);
            setMessage(`Successfully processed ${response.data.total_processed} entries. Updated ${response.data.updated_count} users.`);
            setFile(null);
        } catch (error) {
            console.error('Upload failed:', error);
            setStatus('error');
            setMessage(error.response?.data?.detail || 'Failed to upload file. Please ensure it follows the correct format.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 pb-12 px-6 max-w-4xl mx-auto">
            <div className="mb-12">
                <h1 className="text-4xl font-display font-bold tracking-tighter mb-4 flex items-center gap-4 text-white">
                    <Upload className="text-accent" size={36} /> ADMIN_PORTAL
                </h1>
                <p className="text-white/60 font-mono tracking-tight max-w-2xl">
                    Upload daily score sheets to update participant rankings. The system will automatically detect <strong>Roll Numbers</strong> from email prefixes and normalize names to <strong>UPPERCASE</strong>.
                </p>
            </div>

            <div className="glass-panel p-12 border-dashed border-2 border-white/10 hover:border-accent/40 transition-all text-center relative overflow-hidden group">
                {alreadyUploaded && !forceUpload ? (
                    <div className="relative z-10 flex flex-col items-center py-8">
                        <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-accent/5">
                            <CheckCircle className="text-accent" size={48} />
                        </div>
                        <h2 className="text-2xl font-display font-bold text-white mb-2">SYSTEM_SYNCHRONIZED</h2>
                        <p className="text-white/60 font-mono text-sm mb-10">Today's metrics have already been processed and committed to the database.</p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="px-6 py-3 bg-accent/10 border border-accent/20 rounded-sm">
                                <span className="text-accent font-mono text-xs font-bold tracking-widest uppercase text-white">READY_FOR_NEXT_SESSION</span>
                            </div>
                            <button
                                onClick={() => setForceUpload(true)}
                                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm font-mono text-xs tracking-widest uppercase transition-all flex items-center gap-2 group"
                            >
                                <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" /> FORCE_REUPLOAD
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleUpload} className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <FileSpreadsheet className="text-accent" size={40} />
                        </div>

                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                        />

                        <label
                            htmlFor="file-upload"
                            className="px-8 py-3 bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/40 rounded-sm cursor-pointer font-black text-white text-sm tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                        >
                            {file ? file.name : 'SELECT_DAILY_METRICS'}
                        </label>

                        {file && (
                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-8 px-12 py-4 bg-accent text-background font-display font-black text-lg tracking-wider rounded-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,157,0.3)]"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" /> COMMITTING_DATA...
                                    </>
                                ) : (
                                    'START_SYNCHRONIZATION'
                                )}
                            </button>
                        )}

                        {forceUpload && (
                            <button
                                onClick={() => setForceUpload(false)}
                                className="mt-4 text-[10px] font-mono text-white/40 hover:text-white uppercase tracking-widest transition-colors underline underline-offset-4"
                            >
                                Cancel Reupload
                            </button>
                        )}
                    </form>
                )}

                {status === 'success' && (
                    <div className="mt-8 p-6 bg-accent/10 border border-accent/20 rounded-sm flex items-start gap-4 text-left animate-in fade-in slide-in-from-bottom-4">
                        <CheckCircle className="text-accent shrink-0" size={24} />
                        <div>
                            <p className="text-accent font-black tracking-tight">SYNCHRONIZATION_COMPLETE</p>
                            <p className="text-sm text-white/70 mt-1 font-medium">{message}</p>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="mt-8 p-6 bg-red-500/10 border border-red-500/20 rounded-sm flex items-start gap-4 text-left animate-in fade-in slide-in-from-bottom-4">
                        <XCircle className="text-red-500 shrink-0" size={24} />
                        <div>
                            <p className="text-red-500 font-black tracking-tight">SYNCHRONIZATION_FAILED</p>
                            <p className="text-sm text-white/70 mt-1 font-medium">{message}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUpload;

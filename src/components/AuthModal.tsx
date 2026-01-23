import { useState } from 'react';
import { X, Github, Loader2 } from 'lucide-react';
import { signInWithGithub } from '../lib/auth';

interface AuthModalProps {
    onClose: () => void;
}

export function AuthModal({ onClose }: AuthModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSocialLogin = async (provider: 'github') => {
        setIsLoading(true);
        setError(null);
        try {
            if (provider === 'github') await signInWithGithub();
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Login failed');
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="glass-panel border border-white/10 rounded-2xl w-full max-w-md p-8 relative overflow-hidden shadow-[0_0_100px_rgba(0,243,255,0.1)]">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
                    <X size={20} />
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2 tracking-tight flex items-center justify-center gap-3">
                        <Github size={28} className="text-[#00f3ff]" />
                        GitHub Login
                    </h2>
                    <p className="text-slate-400 text-sm">Use your GitHub account to access Pro features and share incidents.</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => handleSocialLogin('github')}
                        disabled={isLoading}
                        className="w-full py-4 rounded-xl bg-[#24292e] hover:bg-[#2f363d] text-white font-bold flex items-center justify-center gap-3 transition-all border border-white/10 hover:border-[#00f3ff]/50 shadow-lg disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Loader2 size={24} className="animate-spin" />
                        ) : (
                            <>
                                <Github size={24} />
                                <span className="text-lg">Continue with GitHub</span>
                            </>
                        )}
                    </button>

                    <p className="text-center text-[10px] text-slate-500 mt-6 uppercase tracking-widest font-mono">
                        Secure auth via Supabase
                    </p>
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs text-center animate-in slide-in-from-bottom-2">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}

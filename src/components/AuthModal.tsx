import React, { useState } from 'react';
import { X, Mail, Github, Loader2, ArrowRight } from 'lucide-react';
import { signInWithGithub, signInWithMagicLink } from '../lib/auth';

interface AuthModalProps {
    onClose: () => void;
}

export function AuthModal({ onClose }: AuthModalProps) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [magicLinkSent, setMagicLinkSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await signInWithMagicLink(email);
            if (error) throw error;
            setMagicLinkSent(true);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to send magic link');
        } finally {
            setIsLoading(false);
        }
    };

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
                    <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Welcome Back</h2>
                    <p className="text-slate-400 text-sm">Sign in to save history and share incidents.</p>
                </div>

                {magicLinkSent ? (
                    <div className="text-center animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                            <Mail size={32} className="text-green-500" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Check your email</h3>
                        <p className="text-slate-400 text-sm mb-6">
                            We sent a magic link to <strong className="text-white">{email}</strong>.<br />
                            Click it to sign in.
                        </p>
                        <button onClick={onClose} className="text-sm text-slate-500 hover:text-white">Close</button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => handleSocialLogin('github')}
                                disabled={isLoading}
                                className="w-full py-2.5 rounded-lg bg-[#24292e] hover:bg-[#2f363d] text-white font-medium flex items-center justify-center gap-3 transition-all border border-white/5 hover:border-white/20 disabled:opacity-50"
                            >
                                <Github size={18} />
                                Continue with GitHub
                            </button>
                        </div>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                            <div className="relative flex justify-center text-xs"><span className="px-2 bg-[#0d1117] text-slate-500 uppercase tracking-widest">Or via Email</span></div>
                        </div>

                        <form onSubmit={handleMagicLink} className="space-y-3">
                            <div className="relative group">
                                <Mail size={16} className="absolute left-3 top-3 text-slate-500 group-focus-within:text-[#00f3ff] transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-[#00f3ff] transition-colors placeholder-slate-600"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || !email}
                                className="w-full btn-primary py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 text-black bg-[#00f3ff] hover:bg-[#00c2cc] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <div className="flex items-center gap-2">Send Magic Link <ArrowRight size={16} /></div>}
                            </button>
                        </form>
                    </div>
                )}

                {error && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs text-center animate-in slide-in-from-bottom-2">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}

import { X, Zap, Shield, Share2, Layers, Crown } from 'lucide-react';

interface UpgradeModalProps {
    onClose: () => void;
    userEmail?: string;
    userId?: string;
}

export function UpgradeModal({ onClose, userEmail, userId }: UpgradeModalProps) {

    const handleUpgrade = () => {
        // Construct checkout URL with user_id in custom data
        const checkoutUrl = "https://hsr.lemonsqueezy.com/checkout/buy/a23eb1ca-8e3f-4c1a-b301-3789aa360e76";
        const urlToCheck = new URL(checkoutUrl);

        // Pass user ID to LemonSqueezy custom data
        if (userId) {
            urlToCheck.searchParams.append('checkout[custom][user_id]', userId);
            urlToCheck.searchParams.append('checkout[email]', userEmail || '');
        }

        window.open(urlToCheck.toString(), '_blank');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="glass-panel border border-[#00f3ff]/30 rounded-2xl w-full max-w-lg relative overflow-hidden shadow-[0_0_100px_rgba(0,243,255,0.2)] flex flex-col">

                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-[#00f3ff]/20 to-transparent blur-xl pointer-events-none"></div>

                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10">
                    <X size={20} />
                </button>

                <div className="p-8 text-center relative z-10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00f3ff] to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.5)] mx-auto mb-6">
                        <Crown size={32} className="text-white fill-white" />
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Upgrade to <span className="text-[#00f3ff]">PRO</span></h2>
                    <p className="text-slate-400 text-sm mb-8">Unlock the full power of Log Voyager for your team.</p>

                    <div className="bg-white/5 rounded-xl p-6 border border-white/5 text-left mb-8">
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <Share2 size={24} className="text-[#00f3ff] mt-1 shrink-0" />
                                <div>
                                    <h3 className="font-bold text-white text-sm">Share Incident Links</h3>
                                    <p className="text-xs text-slate-400 mt-1">Generate secure, read-only links to specific log lines. Perfect for Slack/Jira.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Layers size={24} className="text-[#ff00ff] mt-1 shrink-0" />
                                <div>
                                    <h3 className="font-bold text-white text-sm">Persistent History</h3>
                                    <p className="text-xs text-slate-400 mt-1">Your recent files and bookmarks are saved to your account. Resume debugging anywhere.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Shield size={24} className="text-emerald-400 mt-1 shrink-0" />
                                <div>
                                    <h3 className="font-bold text-white text-sm">Priority Support</h3>
                                    <p className="text-xs text-slate-400 mt-1">Direct access to the developer for feature requests.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleUpgrade}
                        className="w-full py-4 rounded-xl bg-[#00f3ff] hover:bg-[#00c2cc] text-black font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(0,243,255,0.4)] hover:shadow-[0_0_50px_rgba(0,243,255,0.6)] hover:scale-[1.02]"
                    >
                        <Zap size={20} className="fill-black" /> Upgrade Now - $5/mo
                    </button>
                    <p className="text-[10px] text-slate-500 mt-4">Secure payment via LemonSqueezy. Cancel anytime.</p>
                </div>
            </div>
        </div>
    );
}

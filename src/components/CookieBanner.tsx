import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[400px] z-50 animate-in fade-in slide-in-from-bottom-10 duration-500">
            <div className="glass-card p-6 rounded-xl border border-[#00f3ff]/30 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-[#00f3ff]/10 rounded-lg shrink-0">
                        <Cookie size={24} className="text-[#00f3ff]" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold mb-2">We use cookies 🍪</h3>
                        <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                            We use cookies to enhance your browsing experience, analyze site traffic, and serve better content.
                            By clicking "Accept", you consent to our use of cookies.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleAccept}
                                className="px-4 py-2 bg-[#00f3ff] text-black text-sm font-bold rounded hover:bg-[#00f3ff]/80 transition-colors"
                            >
                                Accept
                            </button>
                            <a href="/privacy" className="px-4 py-2 bg-white/5 text-white text-sm font-bold rounded hover:bg-white/10 transition-colors">
                                Policy
                            </a>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute top-2 right-2 text-slate-500 hover:text-white"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

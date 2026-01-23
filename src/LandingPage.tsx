import { useState, useEffect } from 'react';
import {
    FileText, Zap, Shield, Check, Github, ArrowRight,
    Terminal, Share2, Bug
} from 'lucide-react';
import { signInWithGithub } from './lib/auth';
import { AuthModal } from './components/AuthModal';

/**
 * LOG VOYAGER - SAAS LANDING PAGE
 * Modern, High-Conversion Landing Page designed for DevOps & Developers.
 * Style: Cyberpunk / Glassmorphism (Consistent with the App).
 */

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=JetBrains+Mono:wght@400;700&display=swap');
  
  .font-sans { font-family: 'Inter', sans-serif; }
  .font-mono { font-family: 'JetBrains Mono', monospace; }
  
  .tech-bg {
    background-color: #050505;
    background-image: 
      linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 60px 60px;
  }
  
  .glass-card {
    background: rgba(20, 20, 25, 0.6);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .neon-text-blue { text-shadow: 0 0 15px rgba(0, 243, 255, 0.5); color: #00f3ff; }
  .neon-text-pink { text-shadow: 0 0 15px rgba(255, 0, 255, 0.5); color: #ff00ff; }
  
  .btn-primary {
    background: #00f3ff;
    color: #000;
    box-shadow: 0 0 20px rgba(0, 243, 255, 0.4);
    transition: all 0.3s ease;
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 30px rgba(0, 243, 255, 0.6);
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    transition: all 0.3s ease;
  }
  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #fff;
  }
`;

export default function LandingPage() {
    // State for AuthModal
    const [showAuthModal, setShowAuthModal] = useState(false);


    // Watch for auth state change - if user logs in after clicking upgrade, continue flow
    useEffect(() => {
        // We'll need a way to check if user is logged in. 
        // Ideally LandingPage should receive user state or we verify via supabase
        // For now, let's assume if AuthModal closes and we have pendingUpgrade, we try again?
        // Or simpler: User clicks login, logs in, modal closes. They click upgrade again.
    }, []);

    const handleUpgrade = async () => {
        const { data: { session } } = await import('./lib/supabase').then(m => m.supabase.auth.getSession());

        if (!session?.user) {
            setShowAuthModal(true);
            return;
        }

        const checkoutUrl = "https://hsr.lemonsqueezy.com/checkout/buy/62ffccbc-fe92-4e0b-a870-b53422ef162a";
        const urlToCheck = new URL(checkoutUrl);
        urlToCheck.searchParams.append('checkout[custom][user_id]', session.user.id);
        urlToCheck.searchParams.append('checkout[email]', session.user.email || '');
        window.open(urlToCheck.toString(), '_blank');
    };

    return (
        <div className="min-h-screen text-slate-300 font-sans tech-bg selection:bg-[#00f3ff] selection:text-black overflow-x-hidden">
            <style>{styles}</style>

            {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

            {/* ... rest of JSX ... */}

            {/* --- NAVBAR --- */}
            <nav className="fixed top-0 w-full z-50 glass-card border-b-0 border-b-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#00f3ff] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                            <img
                                src="/LV.png"
                                alt="Log Voyager"
                                className="w-10 h-10 object-contain relative z-10 brightness-125 filter drop-shadow-[0_0_8px_rgba(0,243,255,0.5)] transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <span className="font-bold text-xl text-white tracking-wider group-hover:neon-text-blue transition-all duration-300">
                            LOG VOYAGER
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="/how-it-works" className="hover:text-white transition-colors">How it Works</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                        <a href="https://github.com/hsr88/log-voyager" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                            <Github size={18} /> GitHub
                        </a>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => signInWithGithub()}
                            className="hidden md:flex items-center gap-2 text-sm font-bold text-white hover:text-[#00f3ff] transition-colors"
                        >
                            <Github size={16} /> Log In
                        </button>
                        <a href="/app" className="btn-primary px-6 py-2.5 rounded-full text-sm font-bold tracking-wide">
                            OPEN APP
                        </a>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <header className="pt-40 pb-20 px-6 relative">
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#00f3ff] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs font-mono mb-8 text-[#00f3ff] border border-[#00f3ff]/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f3ff] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f3ff]"></span>
                        </span>
                        v1.2 Released: Smart Search & Warp Jump
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight">
                        Stop Crashing VS Code.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] to-[#ff00ff]">Analyze 10GB+ Logs</span> Instantly.
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        The missing tool for DevOps. Open massive log files in your browser without using RAM.
                        Format JSON, filter errors, and <span className="text-white">share incidents with your team.</span>
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <a href="/app" className="btn-primary px-8 py-4 rounded-lg text-lg font-bold flex items-center gap-2 w-full md:w-auto justify-center">
                            <FileText size={20} /> Open Local File
                        </a>
                        <button onClick={handleUpgrade} className="btn-secondary px-8 py-4 rounded-lg text-lg font-bold flex items-center gap-2 w-full md:w-auto justify-center hover:bg-white/10">
                            Try Pro  <ArrowRight size={20} />
                        </button>
                    </div>

                    <div className="mt-12 text-sm text-slate-500 font-mono">
                        TRUSTED BY DEVELOPERS AT <span className="text-slate-300">...YOUR COMPANY?</span>
                    </div>
                </div>

                {/* Hero Image / App Preview */}
                <div className="mt-16 max-w-6xl mx-auto relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#00f3ff] to-[#ff00ff] rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative glass-card rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                        <div className="bg-[#0d1117] h-8 flex items-center px-4 gap-2 border-b border-white/10">
                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                            <div className="ml-4 text-[10px] text-slate-500 font-mono">logvoyager.cc — production_error.log (8.5 GB)</div>
                        </div>
                        <img src="/scrree.png" alt="App Interface" className="w-full opacity-90" />

                        {/* Fake UI Overlay for effect */}
                        <div className="absolute top-1/4 left-1/4 bg-[#050505]/90 border border-[#ff00ff]/50 p-4 rounded-lg shadow-[0_0_30px_rgba(255,0,255,0.2)] backdrop-blur-md">
                            <div className="text-[#ff00ff] font-mono text-xs mb-2 flex items-center gap-2"><Bug size={12} /> ERROR DETECTED</div>
                            <div className="text-white font-mono text-sm">ConnectionRefused: 10.0.1.5:5432</div>
                            <div className="mt-2 text-xs text-slate-400">Jump to line 4,502,112?</div>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- FEATURES GRID --- */}
            <section id="features" className="py-24 bg-[#080808]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Why Log Voyager?</h2>
                        <p className="text-slate-400">Built for frustration-free debugging.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="glass-card p-8 rounded-2xl hover:bg-white/5 transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6">
                                <Zap size={24} className="text-[#00f3ff]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Instant Load</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Uses <strong>File Slicing API</strong> to read only what you see. Open a 50GB file on an old laptop in milliseconds. No RAM spikes.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="glass-card p-8 rounded-2xl hover:bg-white/5 transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-6">
                                <Shield size={24} className="text-[#ff00ff]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Privacy First</h3>
                            <p className="text-slate-400 leading-relaxed">
                                <strong>100% Local Execution.</strong> Your sensitive logs never leave your browser. Works offline in Airplane Mode. Safe for enterprise use.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="glass-card p-8 rounded-2xl hover:bg-white/5 transition-colors border border-[#00f3ff]/30 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-[#00f3ff] text-black text-[10px] font-bold px-2 py-1">NEW</div>
                            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-6">
                                <Share2 size={24} className="text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Share Incidents</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Found a bug? Select lines and generate a <strong>secure link</strong> to share with your team. No more screenshots or copy-pasting to Slack.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PRICING --- */}
            <section id="pricing" className="py-24 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#ff00ff] rounded-full blur-[150px] opacity-5 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Simple Pricing</h2>
                        <p className="text-slate-400">Open source at heart. Power features for teams.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Free Tier */}
                        <div className="glass-card p-8 rounded-2xl border-white/5 flex flex-col">
                            <div className="mb-4">
                                <span className="text-sm font-mono text-slate-400 uppercase tracking-widest">Hobbyist</span>
                                <div className="text-4xl font-bold text-white mt-2">$0</div>
                                <p className="text-slate-500 text-sm mt-1">Forever free.</p>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-slate-300"><Check size={16} className="text-[#00f3ff]" /> Open Unlimited File Size</li>
                                <li className="flex items-center gap-3 text-slate-300"><Check size={16} className="text-[#00f3ff]" /> Local Processing (Privacy)</li>
                                <li className="flex items-center gap-3 text-slate-300"><Check size={16} className="text-[#00f3ff]" /> JSON Prettifier & Regex</li>
                                <li className="flex items-center gap-3 text-slate-300"><Check size={16} className="text-[#00f3ff]" /> GZIP file support</li>
                            </ul>
                            <a href="/app" className="btn-secondary w-full py-3 rounded-lg text-center font-bold">Use Now</a>
                        </div>

                        {/* PRO Tier */}
                        <div className="glass-card p-8 rounded-2xl border-[#00f3ff] relative shadow-[0_0_50px_rgba(0,243,255,0.1)] flex flex-col">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00f3ff] text-black px-4 py-1 rounded-full text-xs font-bold tracking-wide">
                                RECOMMENDED
                            </div>
                            <div className="mb-4">
                                <span className="text-sm font-mono text-[#00f3ff] uppercase tracking-widest">Pro / Team</span>
                                <div className="text-4xl font-bold text-white mt-2">$5 <span className="text-lg text-slate-500 font-normal">/ mo</span></div>
                                <p className="text-slate-500 text-sm mt-1">Cancel anytime.</p>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-white font-bold"><Check size={16} className="text-[#ff00ff]" /> Everything in Free</li>
                                <li className="flex items-center gap-3 text-white"><Check size={16} className="text-[#ff00ff]" /> Share Incident Links (SaaS)</li>
                                <li className="flex items-center gap-3 text-white"><Check size={16} className="text-[#ff00ff]" /> Persistent Bookmarks History</li>
                                <li className="flex items-center gap-3 text-white"><Check size={16} className="text-[#ff00ff]" /> Team Workspace (Coming Soon)</li>
                                <li className="flex items-center gap-3 text-white"><Check size={16} className="text-[#ff00ff]" /> Priority Support</li>
                            </ul>
                            <button onClick={handleUpgrade} className="btn-primary w-full py-3 rounded-lg text-center font-bold">Buy Pro</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="border-t border-white/10 bg-[#020202] py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <img src="/LV.png" alt="Logo" className="w-5 h-5 opacity-80" />
                        <span className="font-bold text-white tracking-wider">LOG VOYAGER</span>
                    </div>

                    <div className="text-slate-500 text-sm">
                        &copy; 2026 logvoyager.cc • Built by <a href="https://github.com/hsr88" className="text-slate-400 hover:text-white transition-colors">hsr88</a>
                    </div>

                    <div className="flex gap-4">
                        <a href="https://github.com/hsr88/log-voyager" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#00f3ff] transition-colors"><Github size={20} /></a>
                        <a href="https://hsr.in.net/" target="_blank" rel="noopener noreferrer " className="text-slate-500 hover:text-[#00f3ff] transition-colors"><Terminal size={20} /></a>
                    </div>
                </div>
            </footer>

        </div>
    );
}
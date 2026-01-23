import {
    Search, Shield, Share2, Smartphone, Github, ArrowRight,
    Database, Cpu, Layers, Globe
} from 'lucide-react';
import { signInWithGithub } from './lib/auth';

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
    background: rgba(20, 20, 25, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .neon-text-blue { text-shadow: 0 0 15px rgba(0, 243, 255, 0.5); color: #00f3ff; }
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
`;

export default function HowItWorks() {
    return (
        <div className="min-h-screen text-slate-300 font-sans tech-bg selection:bg-[#00f3ff] selection:text-black overflow-x-hidden">
            <style>{styles}</style>

            {/* --- NAVBAR --- */}
            <nav className="fixed top-0 w-full z-50 glass-card border-b-0 border-b-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            {/* Logo from public/LV.png */}
                            <img src="/LV.png" alt="Log Voyager Logo" className="w-10 h-10 rounded-lg shadow-[0_0_15px_rgba(0,243,255,0.3)]" />
                            <span className="font-bold text-xl text-white tracking-wider">LOG VOYAGER</span>
                        </a>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <a href="/" className="hover:text-white transition-colors">Home</a>
                        <span className="text-white">How it Works</span>
                        <a href="/#pricing" className="hover:text-white transition-colors">Pricing</a>
                        <a href="https://github.com/hsr88/log-voyager" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                            <Github size={18} /> GitHub
                        </a>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={() => signInWithGithub()} className="hidden md:flex items-center gap-2 text-sm font-bold text-white hover:text-[#00f3ff] transition-colors">
                            <Github size={16} /> Log In
                        </button>
                        <a href="/app" className="btn-primary px-6 py-2.5 rounded-full text-sm font-bold tracking-wide">OPEN APP</a>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                {/* HERO */}
                <div className="text-center mb-24 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#00f3ff] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 relative z-10">
                        Under the Hood of <span className="neon-text-blue">Log Voyager</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        How we visualize gigabytes of data in milliseconds directly in your browser.
                    </p>
                </div>

                {/* CORE TECHNOLOGY */}
                <section className="mb-24">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="text-[#00f3ff] font-mono text-sm mb-2 tracking-widest uppercase font-bold">The Core Engine</div>
                            <h2 className="text-3xl font-bold text-white mb-6">Infinity Scroll Engine</h2>
                            <p className="text-slate-400 mb-6 leading-relaxed">
                                Traditional editors crash because they try to load the entire file into RAM.
                                Log Voyager uses the <strong className="text-white">File Slicing API</strong> to read only the specific "chunk" you are currently viewing.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 p-1 bg-blue-500/10 rounded"><Database size={16} className="text-[#00f3ff]" /></div>
                                    <div>
                                        <strong className="text-white block">Zero RAM Spikes</strong>
                                        <span className="text-sm text-slate-500">Open a 50GB file on 4GB RAM laptop smoothly.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 p-1 bg-purple-500/10 rounded"><Cpu size={16} className="text-[#ff00ff]" /></div>
                                    <div>
                                        <strong className="text-white block">Instant Rendering</strong>
                                        <span className="text-sm text-slate-500">Virtualization ensures we only render DOM nodes that are visible on screen.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="glass-card p-1 rounded-xl border border-white/10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#00f3ff]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <div className="bg-[#050505] rounded-lg p-6 font-mono text-xs text-slate-500 h-[300px] overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[#050505] to-transparent z-10"></div>
                                <div className="space-y-1 opacity-50">
                                    {[...Array(10)].map((_, i) => <div key={i}>{`[INFO] 2024-05-20 10:00:${10 + i} Reading chunk offset ${i * 1024}...`}</div>)}
                                </div>
                                <div className="my-4 p-4 border border-[#00f3ff]/30 bg-[#00f3ff]/5 rounded text-[#00f3ff]">
                                    <div className="flex justify-between font-bold mb-2"><span>ACTIVE VIEWPORT</span><span>CHUNK #42</span></div>
                                    <div>{`[ERROR] Connection refused at 192.168.1.1`}</div>
                                    <div>{`[WARN] Retrying connection (attempt 2/5)...`}</div>
                                    <div>{`[INFO] Connection established successfully.`}</div>
                                </div>
                                <div className="space-y-1 opacity-50">
                                    {[...Array(5)].map((_, i) => <div key={i}>{`[DEBUG] 2024-05-20 10:01:${12 + i} Processing stream buffer...`}</div>)}
                                </div>
                                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#050505] to-transparent z-10"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* KEY FEATURES GRID */}
                <section className="grid md:grid-cols-3 gap-6 mb-24">
                    {/* Card 1 */}
                    <div className="glass-card p-6 rounded-2xl hover:bg-white/5 transition-colors group">
                        <Search size={32} className="text-[#00f3ff] mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-bold text-white mb-3">Smart Search 2.0</h3>
                        <ul className="text-sm text-slate-400 space-y-2">
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#00f3ff]"></div>
                                Case Sensitivity Toggle
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#00f3ff]"></div>
                                Regex Support (.*)
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#00f3ff]"></div>
                                Search History (Last 10)
                            </li>
                        </ul>
                    </div>

                    {/* Card 2 */}
                    <div className="glass-card p-6 rounded-2xl hover:bg-white/5 transition-colors group">
                        <Shield size={32} className="text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-bold text-white mb-3">Privacy First</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            <strong>100% Local Execution.</strong> We don't upload your logs to any cloud.
                            The browser reads the file directly from your disk.
                            You can disconnect the internet and it will still work perfectly.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="glass-card p-6 rounded-2xl hover:bg-white/5 transition-colors group">
                        <Smartphone size={32} className="text-[#ff00ff] mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-bold text-white mb-3">Zero Install</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Works on Desktop, Mobile (Android/iOS), and Tablets.
                            Debugging on the go? Just open Log Voyager on your phone and load the file.
                        </p>
                    </div>
                </section>

                {/* PRO VS FREE */}
                <section className="glass-card rounded-3xl p-8 md:p-12 mb-24 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#ff00ff] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

                    <div className="md:flex gap-12">
                        <div className="flex-1 mb-8 md:mb-0">
                            <h2 className="text-3xl font-bold text-white mb-6">Why Go Pro?</h2>
                            <p className="text-slate-400 mb-8 leading-relaxed">
                                Log Voyager is Open Source and always will be for local debugging.
                                However, for teams and power users, the Pro plan unlocks collaboration features
                                that save hours of back-and-forth communication.
                            </p>
                            <a href="/app" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold">
                                Start Pro  <ArrowRight size={18} />
                            </a>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start gap-4">
                                <Share2 size={24} className="text-[#00f3ff] mt-1" />
                                <div>
                                    <h4 className="font-bold text-white">Share Incidents</h4>
                                    <p className="text-sm text-slate-400 mt-1">Found a bug? Don't screenshot it. Select the lines and generate a <strong>secure, read-only link</strong> that highlights exactly what went wrong.</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start gap-4">
                                <Layers size={24} className="text-[#ff00ff] mt-1" />
                                <div>
                                    <h4 className="font-bold text-white">Persistent History</h4>
                                    <p className="text-sm text-slate-400 mt-1">Your bookmarks and file history are synced to the cloud, so you can pick up debugging on a different device.</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start gap-4">
                                <Globe size={24} className="text-emerald-400 mt-1" />
                                <div>
                                    <h4 className="font-bold text-white">Team Workspaces (Soon)</h4>
                                    <p className="text-sm text-slate-400 mt-1">Shared team libraries of common error patterns and solutions.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            {/* FOOTER */}
            <footer className="border-t border-white/10 bg-[#020202] py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <img src="/LV.png" alt="Logo" className="w-6 h-6 rounded opacity-80" />
                        <span className="font-bold text-white tracking-wider">LOG VOYAGER</span>
                    </div>
                    <div className="text-slate-500 text-sm">
                        &copy; 2026 logvoyager.cc • Built by <a href="https://github.com/hsr88" className="text-slate-400 hover:text-white transition-colors">hsr88</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

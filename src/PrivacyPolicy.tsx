import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-[#00f3ff] selection:text-black py-20 px-6">
            <div className="max-w-3xl mx-auto glass-card p-12 rounded-2xl border border-white/10 relative">
                <Link to="/" className="inline-flex items-center gap-2 text-[#00f3ff] hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={20} /> Back to Home
                </Link>

                <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
                <p className="text-sm text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="prose prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                        <p>
                            Welcome to Log Voyager. We respect your privacy and are committed to protecting your personal data.
                            This privacy policy explains how we look after your personal data when you visit our website and tell you about your privacy rights.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Data We Collect</h2>
                        <p>
                            <strong>Local Processing:</strong> The core functionality of Log Voyager (log analysis) happens entirely in your browser using local resources.
                            We DO NOT upload your log files to our servers unless you explicitly use the "Share Incident" feature.
                        </p>
                        <ul className="list-disc pl-5 mt-4 space-y-2">
                            <li><strong>Account Data:</strong> If you create an account, we store your email address and authentication via GitHub/Supabase.</li>
                            <li><strong>Usage Data:</strong> We use Google Analytics to collect anonymous usage statistics to improve our service.</li>
                            <li><strong>Shared Snippets:</strong> If you verify and choose to share a log snippet, that specific text snippet is stored in our database.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Cookies</h2>
                        <p>
                            We use cookies to maintain your login session and for analytics purposes. You can control cookies through your browser settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Payment Information</h2>
                        <p>
                            Payments are processed by LemonSqueezy. We do not store your credit card details.
                            LemonSqueezy acts as the Merchant of Record.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Contact Us</h2>
                        <p>
                            If you have any questions about this privacy policy, please contact us at:
                        </p>
                        <a href="mailto:haser88@gmail.com" className="inline-flex items-center gap-2 text-[#00f3ff] mt-4 hover:underline">
                            <Mail size={20} /> haser88@gmail.com
                        </a>
                    </section>
                </div>
            </div>

            <footer className="mt-20 text-center text-slate-500 text-sm">
                &copy; 2026 Log Voyager. All rights reserved.
            </footer>
        </div>
    );
}

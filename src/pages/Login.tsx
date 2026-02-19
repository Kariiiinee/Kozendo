import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { useTranslation } from 'react-i18next';
import { Mail, ArrowRight, Loader2, Flower } from 'lucide-react';
import Header from '../components/Header';
import BottomMenu from '../components/BottomMenu';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: window.location.origin,
                },
            });

            if (error) throw error;
            setSent(true);
        } catch (err: any) {
            setError(err.message || t('auth.error_auth'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#f6f8f6] font-sans text-slate-800 min-h-screen flex flex-col items-center overflow-hidden">
            <div className="w-full max-w-[430px] bg-white h-screen relative flex flex-col shadow-xl overflow-hidden">
                {/* Background Image with Overlay - Match Wellness Scan */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop"
                        alt="Misty forest"
                        className="w-full h-full object-cover brightness-[0.7]"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
                </div>

                {/* Header Navigation - App Standard */}
                <Header title={t('common.app_name')} transparent dark />

                <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20 relative z-10">
                    <div className="w-full max-w-md">
                        {/* Logo/Icon - Aligned with App Design */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-3xl bg-[#13ec13] flex items-center justify-center shadow-lg shadow-[#13ec13]/20 animate-bounce-slow">
                                <Flower className="text-white w-8 h-8" />
                            </div>
                        </div>

                        <div className="text-center mb-8 relative z-10">
                            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                                {t('auth.login')}
                            </h1>
                            <p className="text-white/60 font-medium text-sm">
                                {sent ? t('auth.magic_link_sent') : t('common.intro', 'Your journey to mindfulness starts here.')}
                            </p>
                        </div>

                        {!sent ? (
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-[#13ec13] transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        placeholder={t('auth.email')}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-3xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#13ec13]/20 focus:border-[#13ec13] shadow-sm transition-all text-lg font-medium"
                                    />
                                </div>

                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold animate-shake">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#13ec13] text-slate-900 font-bold py-5 rounded-3xl shadow-xl shadow-[#13ec13]/20 hover:shadow-2xl hover:shadow-[#13ec13]/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-70 disabled:active:scale-100"
                                >
                                    {loading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            {t('auth.send_magic_link')}
                                            <ArrowRight className="w-6 h-6" />
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div className="bg-white/20 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#13ec13]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-[#13ec13]/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#13ec13]/30">
                                        <Mail className="w-8 h-8 text-[#13ec13]" />
                                    </div>
                                    <h2 className="text-3xl font-light text-white mb-3 tracking-tight">
                                        {t('auth.check_email')}
                                    </h2>
                                    <p className="text-white/70 mb-8 font-medium leading-relaxed">
                                        {t('auth.magic_link_sent')}
                                    </p>
                                    <button
                                        onClick={() => setSent(false)}
                                        className="text-[#13ec13] font-bold hover:text-[#13ec13]/80 transition-colors py-2 px-4 rounded-xl hover:bg-white/5"
                                    >
                                        {t('common.back', 'Try another email')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                <BottomMenu />
            </div>
        </div>
    );
};

export default Login;

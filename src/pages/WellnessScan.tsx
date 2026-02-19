import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Accessibility, Heart, Sun, Wind, FileEdit, Send } from 'lucide-react';
import Header from '../components/Header';
import BottomMenu from '../components/BottomMenu';
import { useTranslation } from 'react-i18next';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

const WellnessScan: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useAuth();
    const [hoveredVibe, setHoveredVibe] = React.useState<string | null>(null);
    const [selectedVibe, setSelectedVibe] = React.useState<string | null>(null);

    // Form States
    const [bodyScan, setBodyScan] = React.useState('');
    const [heartScan, setHeartScan] = React.useState('');
    const [envScan, setEnvScan] = React.useState('');
    const [breathAction, setBreathAction] = React.useState('');
    const [reflection, setReflection] = React.useState('');

    const [error, setError] = React.useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const vibes = [
        { id: 'hopeful', emoji: '✨' },
        { id: 'happy', emoji: '😊' },
        { id: 'calm', emoji: '😌' },
        { id: 'neutral', emoji: '😐' },
        { id: 'thoughtful', emoji: '🤔' },
        { id: 'sad', emoji: '😔' },
        { id: 'stressed', emoji: '😤' }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Comprehensive Validation
        if (!bodyScan.trim() || !heartScan.trim() || !envScan.trim() || !reflection.trim() || !selectedVibe) {
            setError(t('scan.error_incomplete'));
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const scanData = {
            body: bodyScan,
            heart: heartScan,
            environment: envScan,
            breathAction: breathAction,
            reflection: reflection,
            vibe: selectedVibe
        };

        const saveToSupabase = async () => {
            try {
                if (user) {
                    const { error } = await supabase.from('posts').insert({
                        user_id: user.id,
                        vibe: selectedVibe,
                        reflection: reflection,
                        body: bodyScan,
                        heart: heartScan,
                        environment: envScan,
                        breath_action: breathAction,
                        created_at: new Date().toISOString()
                    });
                    if (error) console.error('Error saving scan to community:', error);
                } else {
                    console.info('Guest user: Scan saved locally only.');
                }
            } catch (err) {
                console.error('Unexpected error saving scan:', err);
            }
        };

        // Fire and forget save to DB in background
        saveToSupabase();

        // Navigate immediately to the insights page (it will show loading while AI processes)
        navigate('/insights', { state: { scanData } });
    };

    return (
        <div className="bg-[#f6f8f6] font-sans text-slate-800 min-h-screen flex flex-col items-center">
            <div className="w-full max-w-[430px] bg-white min-h-screen relative flex flex-col shadow-xl overflow-hidden">

                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop"
                        alt="Misty forest"
                        className="w-full h-full object-cover brightness-[0.7]"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
                </div>

                {/* Header Navigation */}
                <Header title={t('common.app_name')} transparent dark />

                {/* Progress Indicator */}
                <div className="w-full px-6 mb-8 relative z-10 pt-4">
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden backdrop-blur-md">
                        <div className="h-full bg-[#13ec13] w-2/3 transition-all duration-500 shadow-[0_0_10px_#13ec13]" />
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-1 px-6 pb-32 relative z-10 overflow-y-auto no-scrollbar">
                    <div className="space-y-10">
                        {/* Intro Text */}
                        <section className="text-center space-y-2 mb-4">
                            <p className="text-[#13ec13] font-bold tracking-widest uppercase text-[10px] mb-1">{t('scan.daily_scan')}</p>
                            <h2 className="text-3xl text-white font-light tracking-tight">
                                {t('scan.title_main')} <span className="font-bold">{t('scan.title_sub')}</span>
                            </h2>
                            <p className="text-white/60 text-xs">{t('scan.subtitle')}</p>

                            {error && (
                                <div className="mt-4 p-3 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-200 text-xs font-medium animate-in slide-in-from-top-2 duration-300">
                                    {error}
                                </div>
                            )}
                        </section>

                        <form className="space-y-8" onSubmit={handleSubmit}>
                            {/* Body Scan Section */}
                            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-4">
                                <div className="flex items-center gap-3 text-white">
                                    <div className="w-10 h-10 rounded-full bg-[#13ec13]/10 flex items-center justify-center text-[#13ec13]">
                                        <Accessibility className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">{t('scan.sections.body.title')}</h3>
                                        <p className="text-[10px] text-white/40">{t('scan.sections.body.description')}</p>
                                    </div>
                                </div>
                                <input
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 shadow-sm focus:ring-2 focus:ring-[#13ec13]/50 outline-none transition-all placeholder:text-white/20 text-white text-sm"
                                    placeholder={t('scan.sections.body.placeholder')}
                                    type="text"
                                    value={bodyScan}
                                    onChange={(e) => setBodyScan(e.target.value)}
                                />
                            </div>

                            {/* Heart Scan Section */}
                            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-4">
                                <div className="flex items-center gap-3 text-white">
                                    <div className="w-10 h-10 rounded-full bg-[#13ec13]/10 flex items-center justify-center text-[#13ec13]">
                                        <Heart className="w-5 h-5 fill-[#13ec13]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">{t('scan.sections.heart.title')}</h3>
                                        <p className="text-[10px] text-white/40">{t('scan.sections.heart.description')}</p>
                                    </div>
                                </div>
                                <input
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 shadow-sm focus:ring-2 focus:ring-[#13ec13]/50 outline-none transition-all placeholder:text-white/20 text-white text-sm"
                                    placeholder={t('scan.sections.heart.placeholder')}
                                    type="text"
                                    value={heartScan}
                                    onChange={(e) => setHeartScan(e.target.value)}
                                />
                            </div>

                            {/* Environment Scan Section */}
                            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-4">
                                <div className="flex items-center gap-3 text-white">
                                    <div className="w-10 h-10 rounded-full bg-[#13ec13]/10 flex items-center justify-center text-[#13ec13]">
                                        <Sun className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">{t('scan.sections.environment.title')}</h3>
                                        <p className="text-[10px] text-white/40">{t('scan.sections.environment.description')}</p>
                                    </div>
                                </div>
                                <input
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 shadow-sm focus:ring-2 focus:ring-[#13ec13]/50 outline-none transition-all placeholder:text-white/20 text-white text-sm"
                                    placeholder={t('scan.sections.environment.placeholder')}
                                    type="text"
                                    value={envScan}
                                    onChange={(e) => setEnvScan(e.target.value)}
                                />
                            </div>

                            {/* Breath Action Section */}
                            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-4">
                                <div className="flex items-center gap-3 text-white">
                                    <div className="w-10 h-10 rounded-full bg-[#13ec13]/10 flex items-center justify-center text-[#13ec13]">
                                        <Wind className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">{t('scan.sections.breath.title')}</h3>
                                        <p className="text-[10px] text-white/40">{t('scan.sections.breath.description')}</p>
                                    </div>
                                </div>
                                <textarea
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 shadow-sm focus:ring-2 focus:ring-[#13ec13]/50 outline-none transition-all placeholder:text-white/20 text-white text-sm resize-none h-24"
                                    placeholder={t('scan.sections.breath.placeholder')}
                                    value={breathAction}
                                    onChange={(e) => setBreathAction(e.target.value)}
                                ></textarea>
                            </div>

                            {/* Daily Reflection Section */}
                            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-4">
                                <div className="flex items-center gap-3 text-white">
                                    <div className="w-10 h-10 rounded-full bg-[#13ec13]/10 flex items-center justify-center text-[#13ec13]">
                                        <FileEdit className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">{t('scan.sections.reflection.title')}</h3>
                                        <p className="text-[10px] text-white/40">{t('scan.sections.reflection.description')}</p>
                                    </div>
                                </div>
                                <textarea
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 shadow-sm focus:ring-2 focus:ring-[#13ec13]/50 outline-none transition-all placeholder:text-white/20 text-white text-sm resize-none h-24"
                                    placeholder={t('scan.sections.reflection.placeholder')}
                                    value={reflection}
                                    onChange={(e) => setReflection(e.target.value)}
                                ></textarea>
                            </div>

                            {/* Vibe Selector */}
                            <div className="space-y-4 pb-8">
                                <h3 className="font-bold text-center text-white text-sm">{t('scan.overall_vibe')}</h3>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center bg-white/10 backdrop-blur-md p-4 xs:p-5 rounded-2xl border border-white/10 overflow-x-auto gap-4 no-scrollbar">
                                        {vibes.map((vibe) => (
                                            <button
                                                key={vibe.id}
                                                type="button"
                                                onClick={() => setSelectedVibe(vibe.id === selectedVibe ? null : vibe.id)}
                                                onMouseEnter={() => setHoveredVibe(vibe.id)}
                                                onMouseLeave={() => setHoveredVibe(null)}
                                                className={`text-2xl xs:text-3xl transition-all active:scale-125 flex-shrink-0 ${(hoveredVibe === vibe.id || selectedVibe === vibe.id)
                                                    ? 'scale-125 grayscale-0'
                                                    : 'grayscale opacity-60 hover:opacity-100 hover:grayscale-0'
                                                    }`}
                                            >
                                                {vibe.emoji}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Vibe Description Box */}
                                    <div className="min-h-[60px] flex flex-col items-center justify-center text-center px-4 animate-in fade-in duration-300">
                                        {(() => {
                                            const activeVibe = hoveredVibe || selectedVibe;
                                            if (activeVibe) {
                                                return (
                                                    <>
                                                        <p className="text-[#13ec13] font-bold text-xs uppercase tracking-wider mb-1">
                                                            {t(`scan.vibes.${activeVibe}.label`)}
                                                        </p>
                                                        <p className="text-white/60 text-[10px] leading-relaxed">
                                                            {t(`scan.vibes.${activeVibe}.desc`)}
                                                        </p>
                                                    </>
                                                );
                                            }
                                            return <p className="text-white/30 text-[10px] italic">{t('scan.vibe_hint')}</p>;
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </main>

                {/* Bottom Action Bar */}
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-6 pb-4 pt-4 bg-gradient-to-t from-black/20 to-transparent z-40">
                    {error && (
                        <div className="mb-3 p-3 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-200 text-[10px] font-medium text-center animate-in slide-in-from-bottom-2 duration-300">
                            {error}
                        </div>
                    )}
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg ${isSubmitting
                            ? 'bg-white/10 text-white/40 backdrop-blur-md border border-white/10 cursor-not-allowed'
                            : 'bg-[#13ec13] text-slate-900 shadow-[#13ec13]/30'
                            }`}
                    >
                        <span>{isSubmitting ? t('scan.processing') : t('scan.submit')}</span>
                        <Send className={`w-4 h-4 ${isSubmitting ? 'animate-pulse' : ''}`} />
                    </button>
                </div>

                <BottomMenu />
            </div>
        </div>
    );
};

export default WellnessScan;

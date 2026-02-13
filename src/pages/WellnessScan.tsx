import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Accessibility, Heart, Sun, Wind, FileEdit, Send } from 'lucide-react';
import Header from '../components/Header';

const WellnessScan: React.FC = () => {
    const navigate = useNavigate();
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Comprehensive Validation
        if (!bodyScan.trim() || !heartScan.trim() || !envScan.trim() || !reflection.trim() || !selectedVibe) {
            setError('Please complete all sections to receive your personalized insight.');
            // Scroll to top or error section
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const scanData = {
            body: bodyScan,
            heart: heartScan,
            environment: envScan,
            breathAction: breathAction,
            reflection: reflection,
            vibe: selectedVibe
        };

        // Brief delay for UX feel
        setTimeout(() => {
            navigate('/insights', { state: { scanData } });
        }, 300);
    };

    return (
        <div className="bg-[#f6f8f6] font-sans text-slate-800 min-h-screen flex flex-col items-center">
            <div className="w-full max-w-[430px] bg-white min-h-screen relative flex flex-col shadow-xl">
                {/* iOS Status Bar Placeholder */}
                <div className="h-11 w-full flex items-center justify-between px-6 pt-2">
                    <span className="text-sm font-semibold">9:41</span>
                    <div className="flex gap-1.5 items-center">
                        <div className="w-4 h-4 rounded-full border border-black/20" />
                        <div className="w-4 h-4 rounded-full border border-black/20" />
                    </div>
                </div>

                {/* Header Navigation */}
                <Header title="Daily Scan" />

                {/* Progress Indicator */}
                <div className="w-full px-6 mb-8">
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#13ec13] w-2/3 transition-all duration-500 shadow-[0_0_10px_#13ec13]" />
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-1 px-6 pb-32">
                    <div className="space-y-10">
                        {/* Intro Text */}
                        <section className="text-center space-y-2">
                            <h2 className="text-2xl font-extrabold tracking-tight">Mindful Check-in</h2>
                            <p className="text-slate-500 text-sm">Take a moment to listen to yourself.</p>

                            {error && (
                                <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm font-medium animate-in slide-in-from-top-2 duration-300">
                                    {error}
                                </div>
                            )}
                        </section>

                        <form className="space-y-8" onSubmit={handleSubmit}>
                            {/* Body Scan Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#13ec13]/10 flex items-center justify-center text-[#13ec13]">
                                        <Accessibility className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Body Scan</h3>
                                        <p className="text-xs text-slate-500">Physical sensations</p>
                                    </div>
                                </div>
                                <input
                                    className="w-full bg-slate-50 border-none rounded-xl p-4 shadow-sm focus:ring-2 focus:ring-[#13ec13]/50 outline-none transition-all placeholder:text-slate-400"
                                    placeholder="e.g., head, shoulder, back, legs, feet"
                                    type="text"
                                    value={bodyScan}
                                    onChange={(e) => setBodyScan(e.target.value)}
                                />
                            </div>

                            {/* Heart Scan Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#13ec13]/10 flex items-center justify-center text-[#13ec13]">
                                        <Heart className="w-5 h-5 fill-[#13ec13]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Heart Scan</h3>
                                        <p className="text-xs text-slate-500">Emotional landscape</p>
                                    </div>
                                </div>
                                <input
                                    className="w-full bg-slate-50 border-none rounded-xl p-4 shadow-sm focus:ring-2 focus:ring-[#13ec13]/50 outline-none transition-all placeholder:text-slate-400"
                                    placeholder="e.g., calm, happy, sad, anxious, stressed"
                                    type="text"
                                    value={heartScan}
                                    onChange={(e) => setHeartScan(e.target.value)}
                                />
                            </div>

                            {/* Environment Scan Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#13ec13]/10 flex items-center justify-center text-[#13ec13]">
                                        <Sun className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Environment Scan</h3>
                                        <p className="text-xs text-slate-500">Your surroundings</p>
                                    </div>
                                </div>
                                <input
                                    className="w-full bg-slate-50 border-none rounded-xl p-4 shadow-sm focus:ring-2 focus:ring-[#13ec13]/50 outline-none transition-all placeholder:text-slate-400"
                                    placeholder="e.g., peaceful, cluttered, noisy, work, home"
                                    type="text"
                                    value={envScan}
                                    onChange={(e) => setEnvScan(e.target.value)}
                                />
                            </div>

                            {/* Breath Action Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#13ec13]/10 flex items-center justify-center text-[#13ec13]">
                                        <Wind className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Deep Breath Action</h3>
                                        <p className="text-xs text-slate-500">What action did you think of?</p>
                                    </div>
                                </div>
                                <textarea
                                    className="w-full bg-slate-50 border-none rounded-xl p-4 shadow-sm focus:ring-2 focus:ring-[#13ec13]/50 outline-none transition-all placeholder:text-slate-400 resize-none h-24"
                                    placeholder="After taking a deep breath, I thought of when I..."
                                    value={breathAction}
                                    onChange={(e) => setBreathAction(e.target.value)}
                                ></textarea>
                            </div>

                            {/* Daily Reflection Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#13ec13]/10 flex items-center justify-center text-[#13ec13]">
                                        <FileEdit className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Daily Reflection</h3>
                                        <p className="text-xs text-slate-500">One sentence for today</p>
                                    </div>
                                </div>
                                <textarea
                                    className="w-full bg-slate-50 border-none rounded-xl p-4 shadow-sm focus:ring-2 focus:ring-[#13ec13]/50 outline-none transition-all placeholder:text-slate-400 resize-none h-24"
                                    placeholder="Today I ..."
                                    value={reflection}
                                    onChange={(e) => setReflection(e.target.value)}
                                ></textarea>
                            </div>

                            {/* Vibe Selector */}
                            <div className="space-y-4 pb-8">
                                <h3 className="font-bold text-center">Overall Vibe</h3>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center bg-slate-50 p-4 xs:p-5 rounded-2xl shadow-inner overflow-x-auto gap-2 no-scrollbar">
                                        {[
                                            { emoji: '✨', label: 'Hopeful / Inspired', desc: 'Optimism, motivation, belief that things can improve.' },
                                            { emoji: '😊', label: 'Happy / Content', desc: 'Everyday joy, satisfaction, feeling "okay" with life.' },
                                            { emoji: '😌', label: 'Calm / Peaceful', desc: 'Relaxation, relief, mindfulness, emotional ease.' },
                                            { emoji: '😐', label: 'Neutral / Steady', desc: 'Neither good nor bad — just being.' },
                                            { emoji: '🤔', label: 'Thoughtful / Uncertain', desc: 'Reflection, questioning, mild confusion or contemplation.' },
                                            { emoji: '😔', label: 'Sad / Low', desc: 'Disappointment, loneliness, emotional heaviness.' },
                                            { emoji: '😤', label: 'Stressed / Frustrated', desc: 'Pressure, irritation, feeling overwhelmed.' }
                                        ].map((vibe, i) => (
                                            <button
                                                key={vibe.emoji}
                                                type="button"
                                                onClick={() => setSelectedVibe(vibe.label === selectedVibe ? null : vibe.label)}
                                                onMouseEnter={() => setHoveredVibe(vibe.label)}
                                                onMouseLeave={() => setHoveredVibe(null)}
                                                className={`text-2xl xs:text-3xl transition-all active:scale-125 flex-shrink-0 ${(hoveredVibe === vibe.label || selectedVibe === vibe.label)
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
                                            const vibeInfo = [
                                                { label: 'Happy / Content', desc: 'Everyday joy, satisfaction, feeling "okay" with life.' },
                                                { label: 'Calm / Peaceful', desc: 'Relaxation, relief, mindfulness, emotional ease.' },
                                                { label: 'Neutral / Steady', desc: 'Neither good nor bad — just being.' },
                                                { label: 'Thoughtful / Uncertain', desc: 'Reflection, questioning, mild confusion or contemplation.' },
                                                { label: 'Sad / Low', desc: 'Disappointment, loneliness, emotional heaviness.' },
                                                { label: 'Stressed / Frustrated', desc: 'Pressure, irritation, feeling overwhelmed.' },
                                                { label: 'Hopeful / Inspired', desc: 'Optimism, motivation, belief that things can improve.' }
                                            ].find(v => v.label === activeVibe);

                                            if (vibeInfo) {
                                                return (
                                                    <>
                                                        <p className="text-[#13ec13] font-bold text-sm uppercase tracking-wider mb-1">
                                                            {vibeInfo.label}
                                                        </p>
                                                        <p className="text-slate-500 text-xs leading-relaxed">
                                                            {vibeInfo.desc}
                                                        </p>
                                                    </>
                                                );
                                            }
                                            return <p className="text-slate-300 text-xs italic">Tap an emoji to see how you feel</p>;
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </main>

                {/* Bottom Action Bar */}
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-6 pb-12 bg-gradient-to-t from-white via-white to-transparent z-40">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`w-full ${isSubmitting ? 'bg-slate-300 pointer-events-none' : 'bg-[#13ec13] hover:bg-[#13ec13]/90'} text-slate-900 font-bold py-4 rounded-xl shadow-lg shadow-[#13ec13]/30 transition-all active:scale-95 flex items-center justify-center gap-2`}
                    >
                        <span>{isSubmitting ? 'Processing Scan...' : 'Submit Scan'}</span>
                        <Send className={`w-5 h-5 ${isSubmitting ? 'animate-pulse' : ''}`} />
                    </button>
                </div>

                {/* Background Decoration */}
                <div className="absolute top-20 -right-20 w-64 h-64 bg-[#13ec13]/5 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-40 -left-20 w-48 h-48 bg-[#13ec13]/10 rounded-full blur-3xl -z-10" />
            </div>
        </div>
    );
};

export default WellnessScan;

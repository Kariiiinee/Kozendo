import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Accessibility, Heart, Sun, Wind, FileEdit, Send } from 'lucide-react';

const WellnessScan: React.FC = () => {
    const navigate = useNavigate();

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
                <header className="px-6 py-4 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-30">
                    <button onClick={() => navigate('/')} className="text-slate-500">
                        <X className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg font-bold tracking-tight">Daily Scan</h1>
                    <div className="w-6" />
                </header>

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
                        </section>

                        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); navigate('/insights'); }}>
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
                                    placeholder="e.g., energized, tense, light"
                                    type="text"
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
                                    placeholder="e.g., grateful, anxious, calm"
                                    type="text"
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
                                    placeholder="e.g., peaceful, cluttered, noisy"
                                    type="text"
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
                                        <p className="text-xs text-slate-500">Select a technique</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="py-3 px-4 rounded-xl border-2 border-[#13ec13] bg-[#13ec13]/5 text-sm font-bold text-slate-800 shadow-sm" type="button">Box Breathing</button>
                                    <button className="py-3 px-4 rounded-xl border border-slate-100 bg-slate-50 text-sm font-semibold text-slate-500" type="button">4-7-8 Method</button>
                                </div>
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
                                    placeholder="Today I learned that..."
                                ></textarea>
                            </div>

                            {/* Vibe Selector */}
                            <div className="space-y-4 pb-8">
                                <h3 className="font-bold text-center">Overall Vibe</h3>
                                <div className="flex justify-between items-center bg-slate-50 p-5 rounded-2xl shadow-inner">
                                    {['😔', '😐', '✨', '😊', '🤩'].map((emoji, i) => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            className={`text-3xl transition-all active:scale-125 ${i === 2 ? 'scale-125' : 'grayscale hover:grayscale-0'}`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </form>
                    </div>
                </main>

                {/* Bottom Action Bar */}
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-6 pb-12 bg-gradient-to-t from-white via-white to-transparent z-40">
                    <button
                        onClick={() => navigate('/insights')}
                        className="w-full bg-[#13ec13] hover:bg-[#13ec13]/90 text-slate-900 font-bold py-4 rounded-xl shadow-lg shadow-[#13ec13]/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <span>Submit Scan</span>
                        <Send className="w-5 h-5" />
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

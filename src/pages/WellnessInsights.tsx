import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Brain, Accessibility, Droplets, Wind, Bookmark, Share2, ChevronLeft, MoreHorizontal } from 'lucide-react';
import { mockData } from '../data/mockData';

const WellnessInsights: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#f6f8f6] font-sans text-slate-800 min-h-screen flex justify-center">
            <main className="relative w-full max-w-[430px] h-screen bg-white overflow-hidden flex flex-col shadow-2xl">
                {/* Background Decorative Elements */}
                <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-[#13ec13]/20 rounded-full blur-[80px]" />
                <div className="absolute bottom-[20%] left-[-20%] w-80 h-80 bg-[#13ec13]/10 rounded-full blur-[100px]" />

                {/* Status Bar Area */}
                <div className="h-11 w-full flex items-center justify-between px-8 relative z-10">
                    <span className="text-sm font-semibold">9:41</span>
                    <div className="flex items-center space-x-1.5 opacity-60">
                        <div className="w-4 h-4 rounded-full border border-black/20" />
                        <div className="w-4 h-4 rounded-full border border-black/20" />
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex items-center justify-between px-6 py-4 relative z-10">
                    <button
                        onClick={() => navigate('/scan')}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 backdrop-blur-md shadow-sm border border-black/5"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <span className="font-bold text-lg tracking-tight">Kozendo</span>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 backdrop-blur-md shadow-sm border border-black/5">
                        <MoreHorizontal className="w-6 h-6" />
                    </button>
                </nav>

                {/* Main Content Scroll Area */}
                <div className="flex-1 overflow-y-auto px-6 pt-4 pb-32 relative z-10 no-scrollbar">
                    {/* Analysis Badge */}
                    <div className="flex justify-center mb-6">
                        <div className="inline-flex items-center gap-2 bg-[#13ec13]/10 border border-[#13ec13]/20 px-4 py-1.5 rounded-full">
                            <Sparkles className="text-[#13ec13] w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#13ec13]">Analysis Complete</span>
                        </div>
                    </div>

                    {/* The Insight Glass Card */}
                    <div className="bg-white/70 backdrop-blur-2xl rounded-[1.5rem] p-6 relative overflow-hidden mb-8 border border-white/40 shadow-xl shadow-[#13ec13]/5">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#13ec13]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-[#13ec13] rounded-xl flex items-center justify-center shadow-lg shadow-[#13ec13]/30">
                                <Brain className="text-white w-7 h-7" />
                            </div>
                            <div>
                                <h1 className="text-xl font-extrabold tracking-tight">Your Daily Insight</h1>
                                <p className="text-[10px] uppercase font-bold text-slate-400">AI Personal Assistant</p>
                            </div>
                        </div>

                        {/* Acknowledgment */}
                        <div className="mb-8">
                            <p className="text-lg leading-relaxed font-medium text-slate-700 italic">
                                "{mockData.insights.mainInsight}"
                            </p>
                        </div>

                        {/* Micro Actions */}
                        <div className="space-y-3 mb-8">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#13ec13] mb-2">Micro-Actions</h3>
                            {mockData.insights.microActions.map(action => (
                                <div key={action.id} className="flex items-center gap-4 bg-white/50 p-3.5 rounded-xl border border-white shadow-sm transition-all hover:bg-white active:scale-98">
                                    <div className="w-10 h-10 bg-[#13ec13]/10 rounded-lg flex items-center justify-center text-[#13ec13]">
                                        {action.icon === 'accessibility_new' && <Accessibility className="w-5 h-5" />}
                                        {action.icon === 'water_drop' && <Droplets className="w-5 h-5" />}
                                        {action.icon === 'air' && <Wind className="w-5 h-5" />}
                                    </div>
                                    <span className="font-bold text-sm text-slate-700">{action.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Uplifting Quote */}
                        <div className="border-t border-[#13ec13]/10 pt-6">
                            <p className="italic text-center text-slate-500 font-medium text-sm">
                                "{mockData.insights.upliftingQuote}"
                            </p>
                        </div>
                    </div>

                    {/* Recommended Activity Card */}
                    <div className="rounded-[1.5rem] overflow-hidden relative h-48 mb-6 group cursor-pointer shadow-lg shadow-black/10">
                        <img
                            src={mockData.insights.recommendedActivity.image}
                            alt="Wellness"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-white font-bold text-lg">{mockData.insights.recommendedActivity.title}</span>
                                    <div className="flex items-center gap-2 opacity-80">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#13ec13]" />
                                        <span className="text-white/90 text-xs font-semibold">{mockData.insights.recommendedActivity.duration}</span>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                    <ChevronLeft className="w-6 h-6 text-white rotate-180" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky Footer Actions */}
                <div className="absolute bottom-0 left-0 w-full p-6 pb-12 bg-gradient-to-t from-white via-white to-transparent flex flex-col gap-3 z-20">
                    <button
                        onClick={() => navigate('/stats')}
                        className="w-full bg-[#13ec13] text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#13ec13]/25 hover:opacity-95 active:scale-[0.98] transition-all"
                    >
                        <Bookmark className="w-5 h-5" />
                        Save to History
                    </button>
                    <button className="w-full bg-slate-50 border border-slate-100 text-slate-700 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 active:scale-[0.98] transition-all">
                        <Share2 className="w-5 h-5" />
                        Share Insight
                    </button>
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-slate-100 rounded-full z-30" />
            </main>
        </div>
    );
};

export default WellnessInsights;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Grid, BarChart2, Plus, FileText, Settings, Sparkles, Activity, Bed, Heart, Zap, ChevronRight } from 'lucide-react';
import { mockData } from '../data/mockData';

const HealthStats: React.FC = () => {
    const navigate = useNavigate();

    const days = [
        { day: 'Mon', date: 23, active: false },
        { day: 'Tue', date: 24, active: false },
        { day: 'Wed', date: 25, active: true },
        { day: 'Thu', date: 26, active: false },
        { day: 'Fri', date: 27, active: false },
        { day: 'Sat', date: 28, active: false },
    ];

    return (
        <div className="bg-[#f6f8f6] font-sans text-slate-800 min-h-screen flex justify-center">
            <main className="w-full max-w-[430px] bg-[#f6f8f6] min-h-screen relative shadow-2xl overflow-y-auto no-scrollbar">
                {/* iOS Status Bar Spacer */}
                <div className="h-12 w-full" />

                {/* Top Navigation */}
                <nav className="px-6 py-4 flex items-center justify-between sticky top-0 z-50 bg-[#f6f8f6]/80 backdrop-blur-md">
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-100">
                        <Menu className="w-5 h-5 text-slate-600" />
                    </button>
                    <div className="text-center">
                        <h1 className="text-lg font-extrabold tracking-tighter">KOZENDO</h1>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#13ec13] font-bold">Mindful Wellness</p>
                    </div>
                    <div className="relative">
                        <img
                            src={mockData.user.profileImage}
                            alt="Profile"
                            className="w-10 h-10 rounded-full border-2 border-[#13ec13] object-cover"
                        />
                    </div>
                </nav>

                <div className="px-6 pb-40">
                    {/* Date Selector */}
                    <section className="mt-4 mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-extrabold tracking-tight">Overview</h2>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Oct 2023</span>
                        </div>
                        <div className="flex overflow-x-auto no-scrollbar gap-3.5 pb-2">
                            {days.map((d) => (
                                <div
                                    key={d.date}
                                    className={`flex-shrink-0 flex flex-col items-center justify-center w-14 h-20 rounded-2xl transition-all ${d.active
                                            ? 'bg-[#13ec13] text-white shadow-lg shadow-[#13ec13]/30 scale-105'
                                            : 'bg-white border border-slate-100'
                                        }`}
                                >
                                    <span className={`text-[10px] font-bold uppercase ${d.active ? 'opacity-80' : 'text-slate-400'}`}>{d.day}</span>
                                    <span className="text-lg font-black">{d.date}</span>
                                    {d.active && <div className="w-1.5 h-1.5 bg-white rounded-full mt-1 animate-pulse" />}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Daily Steps Card */}
                        <div className="col-span-2 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Daily Steps</p>
                                    <h3 className="text-3xl font-black mt-1">{mockData.stats.steps.toLocaleString()}</h3>
                                </div>
                                <div className="relative w-20 h-20">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle className="text-slate-100" cx="40" cy="40" fill="transparent" r="34" stroke="currentColor" strokeWidth="8" />
                                        <circle
                                            className="text-[#13ec13]" cx="40" cy="40" fill="transparent" r="34" stroke="currentColor" strokeWidth="8"
                                            strokeDasharray="213.6" strokeDashoffset={213.6 * (1 - mockData.stats.steps / mockData.stats.stepsGoal)}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Activity className="text-[#13ec13] w-6 h-6" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-end justify-between">
                                <span className="text-xs font-bold text-[#13ec13] uppercase tracking-wide">
                                    {Math.round((mockData.stats.steps / mockData.stats.stepsGoal) * 100)}% of goal reached
                                </span>
                                <div className="flex gap-1.5 items-end h-8">
                                    {[3, 4, 6, 5, 7, 8, 6].map((h, i) => (
                                        <div
                                            key={i}
                                            className={`w-1.5 rounded-full ${i === 6 ? 'bg-[#13ec13]' : 'bg-[#13ec13]/20'}`}
                                            style={{ height: `${h * 4}px` }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sleep Summary Card */}
                        <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50 group hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-indigo-50 p-2.5 rounded-xl">
                                    <Bed className="text-indigo-500 w-5 h-5" />
                                </div>
                                <span className="px-2.5 py-1 bg-[#13ec13]/10 text-[#13ec13] text-[10px] font-black rounded-full">Score: {mockData.stats.sleepScore}</span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sleep Duration</p>
                            <h3 className="text-xl font-black mt-1">{mockData.stats.sleep}</h3>
                            <div className="mt-4 flex items-end gap-1 overflow-hidden h-8">
                                {[4, 2, 5, 3, 6, 4].map((v, i) => (
                                    <div key={i} className="flex-1 bg-indigo-100 rounded-t-sm" style={{ height: `${v * 4}px` }} />
                                ))}
                            </div>
                        </div>

                        {/* Heart Rate Card */}
                        <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-rose-50 p-2.5 rounded-xl">
                                    <Heart className="text-rose-500 w-5 h-5 fill-rose-500" />
                                </div>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Heart Rate</p>
                            <div className="flex items-baseline gap-1 mt-1">
                                <h3 className="text-xl font-black">{mockData.stats.heartRate}</h3>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">BPM</span>
                            </div>
                            <div className="mt-2 text-[10px] font-black px-2.5 py-1 bg-slate-50 text-slate-500 rounded-lg inline-block">
                                Resting: {mockData.stats.restingHR}
                            </div>
                            <div className="mt-4 flex items-center justify-between gap-0.5 h-8">
                                {[1, 3, 2, 4, 1, 5, 2, 3].map((v, i) => (
                                    <div key={i} className="flex-1 bg-rose-200 rounded-full" style={{ height: `${v * 4}px` }} />
                                ))}
                            </div>
                        </div>

                        {/* Active Minutes Card */}
                        <div className="col-span-2 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Minutes</p>
                                    <h3 className="text-2xl font-black mt-1">
                                        {mockData.stats.activeMinutes} <span className="text-slate-200">/ {mockData.stats.activeGoal}</span>
                                    </h3>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-[#13ec13]/10 flex items-center justify-center">
                                    <Zap className="text-[#13ec13] w-6 h-6 fill-[#13ec13]" />
                                </div>
                            </div>
                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#13ec13] rounded-full shadow-[0_0_10px_#13ec13]"
                                    style={{ width: `${(mockData.stats.activeMinutes / mockData.stats.activeGoal) * 100}%` }}
                                />
                            </div>
                            <div className="mt-4 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="text-slate-400">Intensity Trend</span>
                                <span className="text-[#13ec13]">+12% vs last week</span>
                            </div>
                        </div>
                    </div>

                    {/* AI Insight Section */}
                    <section className="mt-8 mb-12">
                        <div className="bg-gradient-to-br from-[#13ec13]/5 to-[#13ec13]/20 p-6 rounded-[2rem] border border-[#13ec13]/20 relative overflow-hidden">
                            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/20 rounded-full blur-2xl" />
                            <div className="flex items-start gap-4 relative z-10">
                                <div className="w-12 h-12 bg-white rounded-2xl flex-shrink-0 flex items-center justify-center shadow-sm border border-white">
                                    <Sparkles className="text-[#13ec13] w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Mindful Insight</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed font-medium mt-1.5 italic">
                                        "Your sleep was 15% deeper than yesterday. Consider a morning meditation to sustain this mental clarity."
                                    </p>
                                    <button className="mt-4 text-[10px] font-black text-[#13ec13] uppercase tracking-widest flex items-center gap-1.5 group">
                                        Start Meditation
                                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Bottom Navigation Bar */}
                <div className="fixed bottom-8 left-6 right-6 bg-slate-900/95 backdrop-blur-2xl h-20 rounded-[2.5rem] flex items-center justify-around px-2 shadow-2xl z-50 border border-white/5">
                    <button onClick={() => navigate('/')} className="text-[#13ec13] p-3 transition-colors">
                        <Grid className="w-7 h-7" />
                    </button>
                    <button className="text-slate-500 p-3">
                        <BarChart2 className="w-7 h-7" />
                    </button>
                    <button
                        onClick={() => navigate('/scan')}
                        className="w-16 h-16 bg-[#13ec13] rounded-full -mt-14 shadow-xl shadow-[#13ec13]/40 flex items-center justify-center border-4 border-[#f6f8f6] active:scale-90 transition-all"
                    >
                        <Plus className="text-white w-9 h-9" />
                    </button>
                    <button className="text-slate-500 p-3">
                        <FileText className="w-7 h-7" />
                    </button>
                    <button className="text-slate-500 p-3">
                        <Settings className="w-7 h-7" />
                    </button>
                </div>

                {/* Home Indicator */}
                <div className="fixed bottom-2 left-1/2 -translate-x-1/2 w-28 h-1.5 bg-slate-200 rounded-full" />
            </main>
        </div>
    );
};

export default HealthStats;

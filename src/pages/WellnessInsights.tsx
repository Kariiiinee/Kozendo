import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Brain, Accessibility, Droplets, Wind, Bookmark, ChevronLeft, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import { generateAIInsights, AIInsight } from '../services/aiService';

const WellnessInsights: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const scanData = location.state?.scanData;

    const [loading, setLoading] = React.useState(true);
    const [insight, setInsight] = React.useState<AIInsight | null>(null);

    React.useEffect(() => {
        const fetchInsights = async () => {
            if (scanData) {
                const results = await generateAIInsights(scanData);
                setInsight(results);
                setLoading(false);
            } else {
                // Fallback if no data (e.g., direct navigation)
                setLoading(false);
            }
        };
        fetchInsights();
    }, [scanData]);

    if (loading) {
        return (
            <div className="bg-[#f6f8f6] font-sans text-slate-800 min-h-screen flex justify-center items-center">
                <main className="w-full max-w-[430px] h-screen bg-white flex flex-col items-center justify-center p-8 text-center space-y-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-[#13ec13]/20 rounded-full blur-3xl animate-pulse" />
                        <div className="relative bg-white p-6 rounded-3xl shadow-2xl">
                            <Brain className="w-16 h-16 text-[#13ec13] animate-bounce" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black tracking-tight text-slate-900">Personalizing Your Flow</h2>
                        <div className="flex items-center justify-center gap-2 text-[#13ec13] font-bold uppercase tracking-widest text-xs">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>AI is thinking...</span>
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed px-4">
                        Analyzing your scan results to create a unique micro-routine just for you.
                    </p>
                </main>
            </div>
        );
    }

    if (!insight) {
        return (
            <div className="bg-[#f6f8f6] font-sans text-slate-800 min-h-screen flex justify-center items-center">
                <main className="w-full max-w-[430px] h-screen bg-white flex flex-col items-center justify-center p-8 text-center space-y-6">
                    <p className="text-slate-500">No scan data found. Please complete a scan first.</p>
                    <button
                        onClick={() => navigate('/scan')}
                        className="bg-[#13ec13] text-slate-900 font-bold px-6 py-3 rounded-xl"
                    >
                        Start Scan
                    </button>
                </main>
            </div>
        );
    }

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

                {/* Header Navigation */}
                <Header title="AI Insights" />

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
                    <div className="bg-white/70 backdrop-blur-2xl rounded-[1.5rem] p-6 relative overflow-hidden mb-8 border border-white/40 shadow-xl shadow-[#13ec13]/5 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
                        <div className="mb-8 min-h-[100px]">
                            <p className="text-lg leading-relaxed font-medium text-slate-700 italic">
                                "{insight.mainInsight}"
                            </p>
                        </div>

                        {/* Micro Actions */}
                        <div className="space-y-3 mb-8">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#13ec13] mb-2">Micro-Actions</h3>
                            {insight.microActions.map(action => (
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
                                "{insight.upliftingQuote}"
                            </p>
                        </div>
                    </div>

                    {/* Recommended Activity Card */}
                    <div className="rounded-[1.5rem] overflow-hidden relative h-48 mb-6 group cursor-pointer shadow-lg shadow-black/10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <img
                            src={insight.recommendedActivity.image}
                            alt="Wellness"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-white font-bold text-lg">{insight.recommendedActivity.title}</span>
                                    <div className="flex items-center gap-2 opacity-80">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#13ec13]" />
                                        <span className="text-white/90 text-xs font-semibold">{insight.recommendedActivity.duration}</span>
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
                </div>
            </main>
        </div>
    );
};

export default WellnessInsights;

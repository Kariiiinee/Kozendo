import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Brain, Accessibility, Droplets, Wind, Bookmark, ChevronLeft, Loader2, CheckCircle2 } from 'lucide-react';
import Header from '../components/Header';
import { generateAIInsights, AIInsight } from '../services/aiService';
import { saveScanToHistory } from '../services/historyService';

const WellnessInsights: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const scanData = location.state?.scanData;

    const [loading, setLoading] = React.useState(true);
    const [insight, setInsight] = React.useState<AIInsight | null>(null);
    const [activeActionId, setActiveActionId] = React.useState<number | null>(null);
    const [isSaved, setIsSaved] = React.useState(false);

    const handleSaveToHistory = () => {
        if (!scanData || !insight) return;

        saveScanToHistory({
            vibe: scanData.vibe,
            body: scanData.body,
            heart: scanData.heart,
            environment: scanData.environment,
            reflection: scanData.reflection,
            insight: insight.mainInsight
        });

        setIsSaved(true);
        setTimeout(() => {
            navigate('/history');
        }, 1500);
    };

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
            <div className="bg-[#f6f8f6] font-sans text-slate-800 min-h-screen flex justify-center">
                <main className="w-full max-w-[430px] h-screen bg-white flex flex-col shadow-2xl">
                    <Header title="AI Insights" />
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
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
                    </div>
                </main>
            </div>
        );
    }

    if (!insight) {
        return (
            <div className="bg-[#f6f8f6] font-sans text-slate-800 min-h-screen flex justify-center">
                <main className="w-full max-w-[430px] h-screen bg-white flex flex-col shadow-2xl">
                    <Header title="AI Insights" />
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
                        <p className="text-slate-500">No scan data found. Please complete a scan first.</p>
                        <button
                            onClick={() => navigate('/scan')}
                            className="bg-[#13ec13] text-slate-900 font-bold px-6 py-3 rounded-xl"
                        >
                            Start Scan
                        </button>
                    </div>
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



                {/* Header Navigation */}
                <Header title="AI Insights" />

                {/* Main Content Scroll Area */}
                <div className="flex-1 overflow-y-auto px-6 pt-4 pb-32 relative z-10 no-scrollbar">
                    {/* Analysis Badge */}
                    <div className="flex flex-col items-center mb-6 gap-2">
                        <div className="inline-flex items-center gap-2 bg-[#13ec13]/10 border border-[#13ec13]/20 px-4 py-1.5 rounded-full">
                            <Sparkles className="text-[#13ec13] w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#13ec13]">Analysis Complete</span>
                        </div>

                        {insight.debugError && (
                            <div className="bg-amber-50 border border-amber-200 text-amber-700 text-[10px] px-3 py-1 rounded-lg max-w-xs text-center font-medium animate-pulse">
                                DEBUG: {insight.debugError}
                            </div>
                        )}
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
                                <div
                                    key={action.id}
                                    onMouseEnter={() => setActiveActionId(action.id)}
                                    onMouseLeave={() => setActiveActionId(null)}
                                    onClick={() => setActiveActionId(activeActionId === action.id ? null : action.id)}
                                    className={`relative flex flex-col gap-2 p-3.5 rounded-xl border transition-all duration-300 cursor-help ${activeActionId === action.id
                                        ? 'bg-white border-[#13ec13]/30 shadow-md scale-[1.02]'
                                        : 'bg-white/50 border-white shadow-sm hover:bg-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${activeActionId === action.id ? 'bg-[#13ec13] text-white shadow-inner' : 'bg-[#13ec13]/10 text-[#13ec13]'
                                            }`}>
                                            {action.icon === 'accessibility_new' && <Accessibility className="w-5 h-5" />}
                                            {action.icon === 'water_drop' && <Droplets className="w-5 h-5" />}
                                            {action.icon === 'air' && <Wind className="w-5 h-5" />}
                                        </div>
                                        <span className="font-bold text-sm text-slate-700">{action.text}</span>
                                    </div>

                                    {/* Instruction Expansion */}
                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeActionId === action.id ? 'max-h-24 opacity-100 pb-1' : 'max-h-0 opacity-0'
                                        }`}>
                                        <p className="text-xs text-slate-500 leading-relaxed pl-14 pt-1 animate-in fade-in slide-in-from-top-1">
                                            {action.instruction}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Uplifting Quote */}
                        <div className="border-t border-[#13ec13]/10 pt-6">
                            <p className="italic text-center text-slate-500 font-medium text-base px-2">
                                "{insight.upliftingQuote}"
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sticky Footer Actions */}
                <div className="absolute bottom-0 left-0 w-full px-6 pb-6 pt-3 bg-gradient-to-t from-white via-white to-transparent flex flex-col gap-3 z-20">
                    <button
                        onClick={handleSaveToHistory}
                        disabled={isSaved}
                        className={`w-full font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all text-sm ${isSaved
                            ? 'bg-slate-100 text-slate-400 cursor-default shadow-none'
                            : 'bg-[#13ec13] text-slate-900 shadow-[#13ec13]/25 hover:opacity-95 active:scale-[0.98]'
                            }`}
                    >
                        {isSaved ? (
                            <>
                                <CheckCircle2 className="w-5 h-5 text-[#13ec13]" />
                                Saved to History
                            </>
                        ) : (
                            <>
                                <Bookmark className="w-5 h-5" />
                                Save to History
                            </>
                        )}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default WellnessInsights;

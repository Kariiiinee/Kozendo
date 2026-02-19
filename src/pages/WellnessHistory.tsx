import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import BottomMenu from '../components/BottomMenu';
import { getScanHistory, clearHistory, ScanHistoryItem } from '../services/historyService';
import { Trash2, Send, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import VibeSummary from '../components/VibeSummary';
import CalendarView from '../components/CalendarView';
import VibeTrendGraph from '../components/VibeTrendGraph';
import ScanDetailModal from '../components/ScanDetailModal';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import { deleteScanEntry } from '../services/historyService';

const WellnessHistory: React.FC = () => {
    const [history, setHistory] = useState<ScanHistoryItem[]>([]);
    const [selectedScan, setSelectedScan] = useState<ScanHistoryItem | null>(null);
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const [postingId, setPostingId] = useState<string | null>(null);
    const [justPostedId, setJustPostedId] = useState<string | null>(null);

    useEffect(() => {
        const loadHistory = async () => {
            const data = await getScanHistory();
            setHistory(data);
        };
        loadHistory();
    }, []);

    const handleClear = async () => {
        if (confirm(t('history.clear_confirm'))) {
            await clearHistory();
            setHistory([]);
        }
    };

    const handleDeleteEntry = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm(t('history.delete_entry_confirm'))) {
            await deleteScanEntry(id);
            setHistory(prev => prev.filter(item => item.id !== id));
        }
    };

    const handlePostVibe = async (e: React.MouseEvent, item: ScanHistoryItem) => {
        e.stopPropagation();
        if (!user) {
            alert(t('history.login_to_post'));
            return;
        }

        setPostingId(item.id || null);
        try {
            const { error } = await supabase.from('posts').insert({
                user_id: user.id,
                vibe: item.vibe,
                reflection: item.reflection,
                body: item.body || '',
                heart: item.heart || '',
                environment: item.environment || '',
                breath_action: item.breathAction || '',
                created_at: new Date(item.timestamp).toISOString()
            });

            if (error) throw error;

            setJustPostedId(item.id || null);
            setTimeout(() => setJustPostedId(null), 3000);
        } catch (err) {
            console.error('Error posting vibe:', err);
            alert(t('history.post_error'));
        } finally {
            setPostingId(null);
        }
    };

    return (
        <div className="bg-[#f6f8f6] font-sans text-slate-800 min-h-screen flex justify-center">
            <main className="w-full max-w-[430px] h-screen bg-black flex flex-col shadow-2xl relative overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop"
                        alt="Misty forest"
                        className="w-full h-full object-cover brightness-[0.6]"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
                </div>

                <Header title={t('common.app_name')} transparent dark />

                <div className="flex-1 overflow-y-auto pb-32 no-scrollbar space-y-6 relative z-10 px-6">
                    {/* Page Title */}
                    <div className="pt-4 text-center">
                        <h2 className="text-3xl font-light tracking-tight text-white mb-1">
                            {t('history.title_main')} <span className="font-bold">{t('history.title_sub')}</span>
                        </h2>
                        <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">{t('history.subtitle')}</p>
                    </div>

                    {/* Vibe Summary Stats Card */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/10 p-2 overflow-hidden shadow-2xl">
                        <div className="pt-4 px-4">
                            <h3 className="text-[10px] font-bold text-[#13ec13] uppercase tracking-wider mb-3">{t('history.vibe_distribution')}</h3>
                        </div>
                        <VibeSummary history={history} />
                    </div>

                    {/* Trend Graph Card */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/10 p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[10px] font-bold text-[#13ec13] uppercase tracking-wider">{t('history.mood_trends')}</h3>
                        </div>
                        <VibeTrendGraph history={history} />
                    </div>

                    {/* Calendar View Card */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/10 p-2 shadow-2xl overflow-hidden">
                        <div className="pt-4 px-4">
                            <h3 className="text-[10px] font-bold text-[#13ec13] uppercase tracking-wider mb-2">{t('history.completion_log')}</h3>
                        </div>
                        <CalendarView history={history} />
                    </div>

                    <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="font-bold text-white text-sm">{t('history.recent_entries')}</h3>
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                {t('history.scans_count', { count: history.length })}
                            </span>
                        </div>

                        {history.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-48 text-white/20 bg-white/5 rounded-[2rem] border border-white/10 border-dashed">
                                <Clock className="w-10 h-10 mb-3 opacity-20" />
                                <p className="text-sm font-medium">{t('history.no_history')}</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {history.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => setSelectedScan(item)}
                                        className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-500 cursor-pointer active:scale-[0.98] transition-all hover:bg-white/15"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold tracking-wider uppercase">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(item.timestamp).toLocaleDateString(i18n.language, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                <span className="text-white/10">•</span>
                                                {new Date(item.timestamp).toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {item.vibe && (
                                                    <span className="px-3 py-1 bg-[#13ec13]/20 text-[#13ec13] text-[9px] font-black rounded-full uppercase tracking-[0.1em] border border-[#13ec13]/20">
                                                        {item.vibe}
                                                    </span>
                                                )}

                                                {/* Entry Actions */}
                                                <div className="flex items-center gap-1.5 ml-2">
                                                    <button
                                                        onClick={(e) => item.id && handlePostVibe(e, item)}
                                                        disabled={!item.id || !!postingId || justPostedId === item.id}
                                                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${justPostedId === item.id
                                                            ? 'bg-[#13ec13] text-black'
                                                            : 'bg-white/5 text-white/40 hover:bg-[#13ec13]/20 hover:text-[#13ec13]'
                                                            }`}
                                                        title={t('history.post_vibe')}
                                                    >
                                                        {justPostedId === item.id ? (
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                        ) : (
                                                            <Send className={`w-3.5 h-3.5 ${item.id && postingId === item.id ? 'animate-pulse' : ''}`} />
                                                        )}
                                                    </button>

                                                    <button
                                                        onClick={(e) => item.id && handleDeleteEntry(e, item.id)}
                                                        className="w-7 h-7 rounded-full bg-white/5 text-white/40 flex items-center justify-center hover:bg-rose-500/20 hover:text-rose-400 transition-all"
                                                        title={t('common.delete')}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-white font-medium text-sm mb-4 leading-relaxed line-clamp-2 italic font-serif opacity-90">
                                            "{item.insight}"
                                        </p>
                                        <div className="grid grid-cols-2 gap-3 text-[11px] text-white/40 mt-4 pt-4 border-t border-white/5">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#13ec13] opacity-40" />
                                                <span className="font-bold text-white/50">{t('common.body')}:</span>
                                                <span className="truncate">{item.body}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#13ec13] opacity-40" />
                                                <span className="font-bold text-white/50">{t('common.heart')}:</span>
                                                <span className="truncate">{item.heart}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {history.length > 0 && (
                        <div className="px-6 pb-12">
                            <button
                                onClick={handleClear}
                                className="w-full flex items-center justify-center gap-2 text-white/30 text-[10px] font-bold uppercase tracking-widest hover:text-red-400 py-4 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                {t('history.clear_history')}
                            </button>
                        </div>
                    )}
                </div>

                {selectedScan && (
                    <ScanDetailModal
                        scan={selectedScan}
                        onClose={() => setSelectedScan(null)}
                    />
                )}

                <BottomMenu />
            </main>
        </div>
    );
};

export default WellnessHistory;

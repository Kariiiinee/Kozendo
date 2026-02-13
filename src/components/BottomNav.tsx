import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Grid, BarChart2, Plus, FileText, Settings } from 'lucide-react';

const BottomNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            <div className="fixed bottom-8 left-6 right-6 bg-slate-900/95 backdrop-blur-2xl h-20 rounded-[2.5rem] flex items-center justify-around px-2 shadow-2xl z-50 border border-white/5">
                <button
                    onClick={() => navigate('/')}
                    className={`${isActive('/') ? 'text-[#13ec13]' : 'text-slate-500'} p-3 transition-colors`}
                >
                    <Grid className="w-7 h-7" />
                </button>
                <button
                    onClick={() => navigate('/stats')}
                    className={`${isActive('/stats') ? 'text-[#13ec13]' : 'text-slate-500'} p-3 transition-colors`}
                >
                    <BarChart2 className="w-7 h-7" />
                </button>
                <button
                    onClick={() => navigate('/scan')}
                    className={`w-16 h-16 bg-[#13ec13] rounded-full -mt-14 shadow-xl shadow-[#13ec13]/40 flex items-center justify-center border-4 border-[#f6f8f6] active:scale-90 transition-all ${isActive('/scan') ? 'scale-110' : ''}`}
                >
                    <Plus className="text-white w-9 h-9" />
                </button>
                <button
                    onClick={() => navigate('/insights')}
                    className={`${isActive('/insights') ? 'text-[#13ec13]' : 'text-slate-500'} p-3 transition-colors`}
                >
                    <FileText className="w-7 h-7" />
                </button>
                <button className="text-slate-500 p-3">
                    <Settings className="w-7 h-7" />
                </button>
            </div>
            {/* Home Indicator */}
            <div className="fixed bottom-2 left-1/2 -translate-x-1/2 w-28 h-1.5 bg-slate-200 rounded-full z-50" />
        </>
    );
};

export default BottomNav;

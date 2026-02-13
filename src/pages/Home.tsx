import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flower, Menu, Pause, Volume2, ArrowUp } from 'lucide-react';
import { mockData } from '../data/mockData';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <main className="relative h-screen w-full max-w-[430px] mx-auto overflow-hidden shadow-2xl font-sans bg-[#f6f8f6]">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={mockData.home.backgroundImage}
                    alt="Misty forest"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#102210]/20 via-transparent to-[#102210]/30" />
            </div>

            {/* Header */}
            <header className="relative z-10 pt-11 px-6 pb-2 flex items-end justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#13ec13] flex items-center justify-center shadow-lg">
                        <Flower className="text-white w-5 h-5" />
                    </div>
                    <span className="text-white font-bold tracking-tight text-xl">KOZENDO</span>
                </div>
                <button className="p-2 text-white bg-white/10 rounded-full backdrop-blur-md">
                    <Menu className="w-6 h-6" />
                </button>
            </header>

            {/* Main Content Area */}
            <div className="relative z-10 px-6 pt-12 flex flex-col h-[calc(100%-180px)]">
                {/* Greeting Section */}
                <section className="mb-12">
                    <p className="text-[#13ec13] font-semibold tracking-wide uppercase text-xs mb-1">Morning Ritual</p>
                    <h1 className="text-4xl text-white font-light leading-tight">
                        Good morning,<br />
                        <span className="font-bold">{mockData.user.name}.</span>
                    </h1>
                </section>

                {/* Daily Quote Card */}
                <section
                    className="mt-4 bg-white/40 backdrop-blur-xl p-8 rounded-[1rem] relative overflow-hidden border border-white/20 cursor-pointer transition-all active:scale-95"
                    onClick={() => navigate('/scan')}
                >
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <span className="text-6xl text-[#13ec13] font-serif">"</span>
                    </div>
                    <div className="relative z-10">
                        <p className="font-serif text-2xl leading-relaxed italic text-slate-900 mb-6">
                            "{mockData.home.quote}"
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="h-[1px] w-8 bg-[#13ec13]/40"></div>
                            <p className="text-sm font-semibold tracking-wider text-slate-700 uppercase">{mockData.home.author}</p>
                        </div>
                    </div>
                </section>

                {/* Swipe Up Hint */}
                <div
                    className="mt-auto flex flex-col items-center gap-2 pb-8 opacity-60 cursor-pointer"
                    onClick={() => navigate('/stats')}
                >
                    <p className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">Swipe up for insights</p>
                    <ArrowUp className="text-white w-4 h-4 animate-bounce" />
                </div>
            </div>

            {/* Floating Audio Control Widget */}
            <div className="absolute bottom-8 left-6 right-6 z-20">
                <div className="bg-white/40 backdrop-blur-xl rounded-full px-5 py-3 flex items-center gap-4 border border-white/30">
                    {/* Play Button */}
                    <button className="w-10 h-10 bg-[#13ec13] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#13ec13]/20">
                        <Pause className="w-5 h-5 fill-current" />
                    </button>

                    {/* Audio Info */}
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{mockData.home.ambientSound}</p>
                        <p className="text-[10px] text-slate-600 font-medium">Ambient Sound</p>
                    </div>

                    {/* Volume/Progress Slider Mockup */}
                    <div className="flex items-center gap-3 w-24">
                        <Volume2 className="text-slate-600 w-4 h-4" />
                        <div className="flex-1 h-1 bg-[#13ec13]/20 rounded-full relative overflow-hidden">
                            <div className="absolute left-0 top-0 h-full w-2/3 bg-[#13ec13] rounded-full"></div>
                        </div>
                    </div>
                </div>
                {/* iOS Home Indicator Spacing */}
                <div className="h-4"></div>
            </div>
        </main>
    );
};

export default Home;

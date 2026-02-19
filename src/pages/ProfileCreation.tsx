import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import { useTranslation } from 'react-i18next';
import { Camera, User, Globe, Check, Loader2, ChevronRight, Search, LogOut, Sparkles } from 'lucide-react';
import Header from '../components/Header';
import BottomMenu from '../components/BottomMenu';
import { COUNTRIES } from '../constants/countries';

const PREDEFINED_AVATARS = [
    '🕊️', '🌿', '🧘', '✨', '🌊', '🌸'
];


const ProfileCreation: React.FC = () => {
    const { user, profile, refreshProfile, signOut } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [displayName, setDisplayName] = useState(profile?.display_name || '');
    const [selectedAvatar, setSelectedAvatar] = useState(() => {
        if (profile?.avatar_url && PREDEFINED_AVATARS.includes(profile.avatar_url)) {
            return profile.avatar_url;
        }
        return PREDEFINED_AVATARS[0];
    });
    const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState<string | null>(() => {
        if (profile?.avatar_url && !PREDEFINED_AVATARS.includes(profile.avatar_url)) {
            return profile.avatar_url;
        }
        return null;
    });
    const [country, setCountry] = useState(profile?.country || '');
    const [countrySearch, setCountrySearch] = useState('');
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isCheckingName, setIsCheckingName] = useState(false);
    const [isNameTaken, setIsNameTaken] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditMode = !!profile;

    const filteredCountries = COUNTRIES.filter(c =>
        c.label.toLowerCase().includes(countrySearch.toLowerCase())
    );

    const checkDisplayName = async (name: string) => {
        if (name.length < 3 || (isEditMode && name === profile?.display_name)) {
            setIsNameTaken(false);
            return;
        }

        setIsCheckingName(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('display_name')
                .eq('display_name', name)
                .maybeSingle();

            if (error) throw error;
            setIsNameTaken(!!data);
        } catch (err) {
            console.error('Error checking display name:', err);
        } finally {
            setIsCheckingName(false);
        }
    };

    // Debounce name check
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (displayName) {
                checkDisplayName(displayName);
            } else {
                setIsNameTaken(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [displayName]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setError(null);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setUploadedAvatarUrl(publicUrl);
        } catch (err: any) {
            setError(err.message || 'Failed to upload image');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.from('profiles').upsert({
                id: user.id,
                display_name: displayName,
                avatar_url: uploadedAvatarUrl || selectedAvatar,
                country: country,
                updated_at: new Date().toISOString(),
            });

            if (error) throw error;

            await refreshProfile();
            navigate('/');
        } catch (err: any) {
            setError(err.message || t('profile.error_save'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#f6f8f6] font-sans text-slate-800 min-h-screen flex flex-col items-center overflow-hidden">
            <div className="w-full max-w-[430px] bg-white h-screen relative flex flex-col shadow-xl overflow-hidden">
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

                <Header title={t('common.app_name')} transparent dark />

                <main className="flex-1 px-6 pt-4 pb-10 max-w-lg mx-auto w-full relative z-10 overflow-y-auto no-scrollbar">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#13ec13]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

                        <form onSubmit={handleSaveProfile} className="space-y-8 relative z-10">
                            {/* Header Section Inside Card */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 bg-[#13ec13] rounded-2xl flex items-center justify-center shadow-lg shadow-[#13ec13]/30">
                                    <Sparkles className="text-slate-900 w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-2xl font-light tracking-tight text-white leading-tight">
                                        {isEditMode ? t('profile.title_edit', 'Edit Your') : t('profile.title_main', 'Complete Your')} <span className="font-bold">{t('profile.title_sub', 'Profile')}</span>
                                    </h1>
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-white/30">
                                        {isEditMode ? t('profile.subtitle_edit', 'Update your details') : t('profile.subtitle', 'Let\'s get to know you better')}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => signOut()}
                                    className="p-2 text-white/40 hover:text-white transition-colors self-start"
                                    title={t('auth.sign_out')}
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Avatar Selection */}
                            <section className="space-y-4">
                                <div className="flex flex-col items-center gap-6">
                                    {/* Preview */}
                                    <div className="relative group">
                                        <div className="w-32 h-32 rounded-[2.5rem] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-6xl shadow-xl overflow-hidden relative">
                                            {uploadedAvatarUrl ? (
                                                <img src={uploadedAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="relative z-10">{selectedAvatar}</span>
                                            )}
                                            <div className="absolute inset-0 bg-[#13ec13]/5" />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#13ec13] rounded-full flex items-center justify-center text-white shadow-lg active:scale-90 transition-all border-4 border-black/20"
                                        >
                                            <Camera className="w-5 h-5 text-slate-900" />
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </div>

                                    {/* Predefined Options */}
                                    <div className="grid grid-cols-4 xs:grid-cols-6 gap-3">
                                        {PREDEFINED_AVATARS.map((emoji) => (
                                            <button
                                                key={emoji}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedAvatar(emoji);
                                                    setUploadedAvatarUrl(null);
                                                }}
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all active:scale-95 ${!uploadedAvatarUrl && selectedAvatar === emoji
                                                    ? 'bg-[#13ec13] shadow-lg shadow-[#13ec13]/20 scale-110 text-slate-900'
                                                    : 'bg-white/5 border border-white/10 text-white'
                                                    }`}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Form Fields */}
                            <section className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 pl-1">
                                        {t('profile.display_name')}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="w-5 h-5 text-[#13ec13]/50" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            placeholder={t('profile.display_name_placeholder')}
                                            className={`w-full pl-12 pr-4 py-4 bg-white/5 border rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 transition-all text-sm font-medium ${isNameTaken
                                                ? 'border-red-500/50 focus:ring-red-500/20'
                                                : 'border-white/10 focus:ring-[#13ec13]/30 focus:border-[#13ec13]/50'
                                                }`}
                                        />
                                        {isCheckingName && (
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                                <Loader2 className="w-4 h-4 animate-spin text-[#13ec13]" />
                                            </div>
                                        )}
                                    </div>
                                    {isNameTaken && (
                                        <p className="text-red-400 text-[10px] font-bold pl-1 animate-in fade-in slide-in-from-top-1">
                                            {t('profile.display_name_taken')}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2 relative">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 pl-1">
                                        {t('profile.country')}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Globe className="w-5 h-5 text-[#13ec13]/50" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            readOnly
                                            value={country}
                                            onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                            placeholder={t('profile.country_placeholder')}
                                            className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#13ec13]/30 focus:border-[#13ec13]/50 transition-all text-sm font-medium cursor-pointer"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <ChevronRight className={`w-5 h-5 text-white/20 transition-transform ${isCountryDropdownOpen ? 'rotate-90' : ''}`} />
                                        </div>
                                    </div>

                                    {/* Country Dropdown */}
                                    {isCountryDropdownOpen && (
                                        <div className="absolute z-20 top-full left-0 right-0 mt-2 bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="p-3 border-b border-white/5 relative">
                                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                                <input
                                                    type="text"
                                                    autoFocus
                                                    placeholder="Search country..."
                                                    className="w-full pl-10 pr-4 py-2 bg-white/5 rounded-xl text-xs text-white placeholder:text-white/20 focus:outline-none"
                                                    value={countrySearch}
                                                    onChange={(e) => setCountrySearch(e.target.value)}
                                                />
                                            </div>
                                            <div className="max-h-48 overflow-y-auto no-scrollbar">
                                                {filteredCountries.map((c) => (
                                                    <button
                                                        key={c.value}
                                                        type="button"
                                                        onClick={() => {
                                                            setCountry(c.label);
                                                            setIsCountryDropdownOpen(false);
                                                        }}
                                                        className="w-full px-6 py-3 text-left hover:bg-white/5 flex items-center justify-between text-white/80 text-xs font-medium"
                                                    >
                                                        {c.label}
                                                        {country === c.label && <Check className="w-4 h-4 text-[#13ec13]" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-200 text-xs font-bold flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !displayName || !country || isNameTaken || isCheckingName}
                                className="w-full bg-[#13ec13] text-slate-900 font-bold py-5 rounded-3xl shadow-xl shadow-[#13ec13]/20 hover:shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:grayscale disabled:active:scale-100 mt-4"
                            >
                                {loading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    isEditMode ? t('profile.update_profile', 'Update Profile') : t('profile.save_profile')
                                )}
                            </button>
                        </form>
                    </div>
                </main>

                <BottomMenu />
            </div>
        </div>
    );
};

export default ProfileCreation;

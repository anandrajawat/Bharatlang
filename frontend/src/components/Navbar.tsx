import React from 'react';
import { Bot, Mic, MessageSquare, BookOpen, BarChart3, Cpu, Sparkles, Globe } from 'lucide-react';
import { getTranslation } from '../i18n/translations';

interface NavbarProps {
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  isModelReady: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeScreen,
  setActiveScreen,
  selectedLanguage,
  setSelectedLanguage,
  isModelReady
}) => {
  const t = getTranslation(selectedLanguage);

  const navItems = [
    { id: 'home', label: t.nav.home, icon: Bot },
    { id: 'voice', label: t.nav.voice, icon: Mic },
    { id: 'chat', label: t.nav.chat, icon: MessageSquare },
    { id: 'kb', label: t.nav.kb, icon: BookOpen },
    { id: 'eval', label: t.nav.eval, icon: BarChart3 }
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[70px] py-2">
          {/* Logo & Product Brand */}
          <div
            className="flex items-center space-x-3 cursor-pointer select-none group"
            onClick={() => setActiveScreen('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-orange-500/20 ring-2 ring-white/10 group-hover:scale-105 transition-transform shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  BharatLangTech AI
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  {t.nav.dialectBadge}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block leading-none mt-1">
                {t.nav.tagline}
              </p>
            </div>
          </div>

          {/* Navigation Pills (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1.5 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveScreen(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Apple Silicon Status & Dynamic Language Selector */}
          <div className="flex items-center space-x-3">
            {/* Apple Silicon Hardware Chip */}
            <div className="hidden lg:flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300 shadow-inner">
              <Cpu className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="font-medium">{t.nav.appleM2}</span>
            </div>

            {/* Language Selection Dropdown */}
            <div className="relative flex items-center">
              <div className="absolute left-2.5 pointer-events-none text-indigo-400">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                aria-label="भाषा निवडा (Select Language)"
                className="bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white text-xs rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold cursor-pointer shadow-sm transition-all"
              >
                <option value="mr">मराठी (Marathi)</option>
                <option value="mr-varhadi">वऱ्हाडी (Varhadi - Vidarbha)</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="md:hidden flex overflow-x-auto px-2 py-2 border-t border-slate-800 space-x-1.5 scrollbar-none bg-slate-950">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 bg-slate-800/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
